# Efrei Para — Sécurité

> **Périmètre** : modèle de menace et invariants à ne jamais casser (secrets, HTML du contenu, liens, CSP, conteneur, dépôt public).
> **À mettre à jour** dès qu'une variable d'environnement, un `v-html`, une origine externe, un en-tête nginx, l'image Docker ou l'exposition du site change.

## Modèle de menace

- Site **statique et public** : nginx sert des fichiers générés au build. Pas de serveur applicatif, pas d'API, pas de compte, pas de cookie (même pour la langue : `detectBrowserLanguage: false`, la langue vient de l'adresse, `/en/…` pour l'anglais), aucune saisie du visiteur n'est envoyée au site (les formulaires sont externes).
- Le contenu vient du dépôt, modifié par les membres qui y ont accès : il est fiable mais pas infaillible, d'où le nettoyage du HTML.
- Le code est **open source** (dépôt GitHub public) : tout ce qui est commité est lu par n'importe qui.
- Les risques réels sont donc : la **fuite d'un secret** dans le bundle ou le dépôt, une **injection de script** par le contenu, une **origine externe** non maîtrisée, la **chaîne de dépendances** (outils de build), et la configuration nginx / Docker.

## Invariants

### 1. Aucun secret côté navigateur

- Tout ce qui est dans `runtimeConfig.public` est écrit dans le HTML et le JavaScript envoyés au visiteur : rien de secret n'y entre. `CDN_DEV_TOKEN` n'y est injecté qu'en `NODE_ENV=development` (`nuxt.config.ts`) et n'est utilisé qu'en dev (`useCdnAsset`) ; un build de production ne le contient jamais, même s'il est présent dans l'environnement.
- Les build args Docker sont visibles dans l'historique de l'image : ils ne portent que des valeurs publiques (`CDN_URL`, `PLAUSIBLE_URL`, `PLAUSIBLE_DOMAIN`). Un secret de build passerait par `docker build --secret`, jamais par `ARG`.
- `.env` est hors dépôt (`.gitignore`) et hors image (`.dockerignore`) ; seul `.env.example`, sans valeur, est versionné. Clés et identifiants (`*.pem`, `*.key`, `*.p12`, `*.pfx`, `credentials*.json`, `.npmrc`) sont aussi ignorés par git.
- `bun dev` reste en localhost (ni `--host` ni `--public`) : en dev, le payload des pages et les DevTools contiennent `CDN_DEV_TOKEN`.

### 2. HTML issu du contenu

- **Aucun `v-html`** : la règle ESLint `vue/no-v-html` est en erreur. Le Markdown du contenu passe par `<MDC>`, qui le rend en éléments Vue (jamais en `innerHTML`) et retire les attributs `on*`, `srcdoc` et les liens `javascript:`. Cas en place : paragraphes de l'accueil (`pages/index.vue`), introduction d'activité (`ActiviteIntro`), réponses de la FAQ (`pages/faq.vue`). `<MDC>` n'est pas un nettoyeur complet : il ne reçoit que du contenu du dépôt, jamais une saisie de visiteur ni une donnée externe.
- Partout ailleurs, le texte est affiché par interpolation Vue (échappé).
- Les champs qui acceptent du HTML ou du Markdown sont listés dans [CONTENT.md](CONTENT.md#formats-acceptés) ; en ajouter un passe aussi par `<MDC>`.

### 3. Liens externes

- Un lien externe s'ouvre dans un nouvel onglet avec `rel="noopener noreferrer"` : `NuxtLink` / `UButton` l'ajoutent pour une URL externe ; le Markdown de Content passe par `rehype-target-blank.mjs` ; un lien écrit à la main avec `target="_blank"` porte le `rel`.
- Les redirections (`RedirectPage`) n'envoient que vers des URL du dépôt (`club.yml`, `rejoindre.yml`), jamais vers une adresse lue dans la query string.
- Les liens écrits dans le contenu n'acceptent que `https:`, `mailto:`, un chemin du site ou une ancre (schéma `href` de `content.schemas.ts`, [CONTENT.md](CONTENT.md#formats-acceptés)) : un lien `javascript:` ou `data:` fait échouer les tests de contenu.

### 4. CSP et origines externes

Tous les en-têtes sont dans [`nginx/security-headers.conf.template`](../nginx/security-headers.conf.template), ré-inclus dans chaque `location` qui pose un en-tête ([ARCHITECTURE.md](ARCHITECTURE.md#nginx)) :

- `Content-Security-Policy` : `default-src 'self'` ; scripts et styles `'self' 'unsafe-inline'` (payload en ligne de Nuxt) ; images `'self' data: ${CDN_URL} https://efreipicturestudio.fr` (couvertures d'albums, désactivées dans `SharedAlbumCard` tant que leur API répond `Cross-Origin-Resource-Policy: same-origin` ; origine gardée pour les rétablir) ; médias `'self' ${CDN_URL}` ; connexions `'self' ${PLAUSIBLE_URL}` ; polices `'self' data:` ; `object-src 'none'`, `frame-ancestors 'self'`, `base-uri 'self'`, `form-action 'self'`.
- `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (capteurs, caméra, micro, géolocalisation, paiement, USB coupés), `Strict-Transport-Security: max-age=31536000` (sans `includeSubDomains` ni `preload`).

Règles :

- **Toute nouvelle origine** (image, vidéo, script, police, appel réseau, iframe) est ajoutée à la directive concernée **dans le même commit** que le code qui l'utilise, au plus juste (pas de `https:` générique). Sans cela, le navigateur la bloque en production alors qu'elle fonctionne en `bun dev`.
- Pas de script tiers : le traceur Plausible est intégré au bundle ; polices et icônes sont servies par le site.

### 5. Service et conteneur

- Image de service **non-root** (`nginx-unprivileged`, utilisateur 101, port 8080) contenant uniquement `.output/public`.
- Les chemins commençant par `.` sont refusés ; un 403 est rendu comme une 404 ; une page inconnue répond un vrai **404** (pas de page 404 en 200). `server_tokens off`.
- Images de base suivies par tag (`oven/bun:1.4-alpine`, `nginx-unprivileged:alpine-slim`), sans digest.

### 6. Dépendances

- Toutes les dépendances servent au build : une vulnérabilité touche la machine de développement et la construction de l'image, pas le visiteur — sauf le code effectivement embarqué dans le bundle (Vue, Nuxt UI, le rendu de `<MDC>`…).
- Après une mise à jour des paquets, `bun audit` ; une vulnérabilité critique ou élevée se traite (mise à jour ou `overrides`) avant de publier.

### 7. Dépôt public

- Aucun secret, jeton, mot de passe ni fichier `.env` dans le dépôt ou son historique.
- Aucune information d'infrastructure au-delà du nécessaire : pas d'adresse de préproduction, d'hébergeur, d'IP, de chemin de déploiement ni de journal de déploiement dans les fichiers versionnés (documentation comprise).
- Les seules données personnelles publiées sont celles destinées au public (contacts du club et du mainteneur affichés sur le site).
