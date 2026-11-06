# Efrei Para — Architecture

> **Périmètre** : comment le site est construit — stack, organisation du code, chargement du contenu, SEO, CDN, génération, conteneur et déploiement.
> **À mettre à jour** dès qu'un module, un composable, l'organisation des dossiers, `nuxt.config.ts`, le `Dockerfile`, la configuration nginx, une variable d'environnement ou le déploiement change.
> Le comportement attendu est dans [PRD.md](PRD.md), le modèle de contenu dans [CONTENT.md](CONTENT.md), les règles de sécurité dans [SECURITY.md](SECURITY.md).

## Stack

| Sujet                    | Décision                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Paquets et build         | **Bun** (`bun.lock`)                                                                                                       |
| Framework                | **Nuxt 4** + Vue 3 (`<script setup lang="ts">`) + TypeScript                                                               |
| UI                       | **Nuxt UI 4** + **Tailwind CSS 4**, thème clair et sombre                                                                  |
| Contenu                  | **Nuxt Content 3** : collections YAML / Markdown typées par Zod                                                            |
| Rendu                    | **Site statique** généré par `nuxt generate` (SSR au build, aucun serveur Node)                                            |
| Service                  | **nginx** (image non-root) dans Docker                                                                                     |
| Images et vidéo          | CDN externe (`CDN_URL`), servi derrière Cloudflare                                                                         |
| Polices                  | `@nuxt/fonts`, fichiers locaux dans `public/`                                                                              |
| Icônes                   | `@nuxt/icon` : Tabler, Simple Icons et collections maison, embarquées au build                                             |
| Audience                 | Plausible (`@nuxtjs/plausible`), instance auto-hébergée (`PLAUSIBLE_URL`)                                                  |
| Mise en forme du contenu | `<MDC>` de `@nuxtjs/mdc` (fourni par Nuxt Content) : Markdown des champs YAML analysé au `generate`, rendu en éléments Vue |
| Qualité                  | ESLint (`@nuxt/eslint`) + Prettier (plugin Tailwind)                                                                       |

`typescript` est bloqué en `6.0.x` (commentaire dans `package.json`) tant que `typescript-eslint` ne gère pas TS 7. Les images sont des `<img>` simples pointant vers le CDN (pas de `@nuxt/image`).

### Contraintes structurantes

- **Aucun serveur à l'exécution** : pas d'API, pas de base de données, pas de cookie. La seule route de `server/` (`/llms.txt`) est prérendue en fichier. Tout ce qui dépend de la configuration (`runtimeConfig`, variables d'environnement, contenu) est figé au moment du `generate` : changer une valeur impose de reconstruire.
- **SSR obligatoire** (`ssr: true`) : Nuxt Content interroge sa base SQLite pendant le prérendu, et chaque page est écrite en HTML complet avec son payload.
- **Interactivité côté navigateur uniquement** : bannière d'événement (`ClientOnly`), accessibilité, thème, filtres de la galerie, compteurs animés, redirections.
- **Appels externes limités** au CDN et à Plausible ; polices et icônes sont servies par le site. Toute nouvelle origine doit d'abord être ajoutée à la CSP ([SECURITY.md](SECURITY.md#4-csp-et-origines-externes)).

## Organisation du code

```
app/
├── app.vue           # racine : bannière, en-tête, page, pied ; classes d'accessibilité ; useSeo
├── app.config.ts     # thème Nuxt UI (couleurs, réglages globaux des composants)
├── error.vue         # page d'erreur (messages en français)
├── assets/
│   ├── css/main.css  # Tailwind + Nuxt UI, palette navy, couleurs, utilitaires, accessibilité
│   ├── icons/        # collections d'icônes maison (efreipara, efrei, ifly, creativecommons, activite)
│   └── images/       # avion.svg, qr.svg, main-hero.webp (affiche de la vidéo)
├── components/       # rangés par zone : activite/, app/, header/, home/, legal/, redirect/, shared/
├── composables/      # useXxx.ts (contenu partagé, SEO, CDN, accessibilité…)
├── pages/            # routes (noms en français)
├── plugins/          # media-guard.client.ts : ni menu contextuel ni glisser sur img / video / picture ;
│                     # link-goals.client.ts : événement Plausible à chaque clic de lien
└── utils/            # fonctions pures, sans Nuxt, testées par Vitest
server/routes/        # llms.txt.ts : version Markdown du site, prérendue
content/
├── global/           # données communes à plusieurs pages (navigation, SEO, CTA, partenaires, événement)
└── pages/            # une source par page ; activites/ et legal/ en plusieurs fichiers
content.schemas.ts    # source et schéma Zod de chaque collection (importés aussi par les tests)
content.routes.ts     # routes de redirection lues dans le contenu (prérendu, tests)
content.config.ts     # déclare les collections (defineCollection) à partir de content.schemas.ts
nuxt.config.ts        # modules, icônes, polices, Content, Plausible, prérendu, minification
rehype-target-blank.mjs  # plugin Markdown : liens externes en nouvel onglet
public/               # polices, favicon, icône tactile, robots.txt, images OpenGraph (seo/), logos partenaires
nginx/                # templates de configuration (serveur, en-têtes de sécurité)
tests/                # unit/ et content/ (Vitest), e2e/ (Playwright) : voir TESTING.md
scripts/cdn-build.ts  # médias du CDN : originaux de cdn/sources/ → cdn/dist/ (CONTENT.md)
cdn/                  # originaux et fichiers générés pour le CDN, ignoré par git
.mcp.json             # serveurs MCP du projet (Playwright sur Brave, pour Claude Code)
Dockerfile            # build Bun puis service nginx
```

### Composants

Nuxt importe les composants automatiquement en préfixant le nom du dossier : `components/activite/Hero.vue` s'utilise en `<ActiviteHero>`, `components/shared/PageHero.vue` en `<SharedPageHero>`. Le rôle de chacun est dans [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md#composants-réutilisables).

- `app/` : cadre de toutes les pages (en-tête, pied, bannière d'événement).
- `activite/` : sections d'une page d'activité, assemblées par `ActivitePage`.
- `legal/`, `redirect/` : rendu des routes servies par `pages/[slug].vue`.
- `shared/` : blocs réutilisés par plusieurs pages.

### Routes

| Fichier                                                                         | Routes                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pages/index.vue`                                                               | `/`                                                                                                                                                                                                         |
| `pages/activites/index.vue`                                                     | `/activites`                                                                                                                                                                                                |
| `pages/activites/[activite].vue`                                                | `/activites/oa`, `/tandem`, `/soufflerie`, `/pac` (`validate` : `isActivity`, autre clé → 404)                                                                                                              |
| `pages/[slug].vue`                                                              | page légale dont le `path` vaut `/<slug>` (`LegalPage`), sinon redirection décrite par le contenu (`RedirectPage` : réseau de `redirects.yml › socials`, ou option de `rejoindre.yml`) ; autre valeur → 404 |
| `pages/galerie.vue`, `documents.vue`, `faq.vue`, `rejoindre.vue`, `contact.vue` | page du même nom                                                                                                                                                                                            |
| `pages/qr.vue`                                                                  | `/qr`, sans layout (`definePageMeta({ layout: false })`) : `app.vue` masque bannière, en-tête et pied via `useLayout()`                                                                                     |

### Composables

| Composable                      | Rôle                                                                                                                                                                                                |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useNavigation`                 | Collection `navigation` : liens de l'en-tête (triés par `header`), du pied, accessibilité                                                                                                           |
| `usePartners`                   | Collection `partners`, filtre par activité                                                                                                                                                          |
| `useActivities`, `useNextEvent` | (`useActivities.ts`) activités dans l'ordre (menu, icône, libellés, `byKey`, `getIcon`, `getGalleryLabel`) ; prochain événement et règle d'affichage                                                |
| `useLabels`                     | Collection `labels` : libellés des composants communs                                                                                                                                               |
| `useClub`                       | Collection `club` : coordonnées, réseaux (`getSocial(key)`), liens d'itinéraire (`maps`), dépôt GitHub                                                                                              |
| `useSeo`                        | Métadonnées d'une page depuis `seo.yml`                                                                                                                                                             |
| `useCdnAsset`                   | `buildCdnUrl(chemin)` : adresse complète sur le CDN (appelle `resolveCdnUrl` avec la config) ; `cdnImage(base, emplacement)` : `src`, `srcset`, `sizes` d'une photo                                 |
| `useCategoryColor`              | Classes Tailwind d'une couleur de catégorie (Documents, FAQ)                                                                                                                                        |
| `useAccessibility`              | Options d'accessibilité : état partagé, `localStorage`, classes sur `<html>`                                                                                                                        |
| `useSmoothScroll`               | `scrollToId(id, { focus })` : défilement doux interruptible, immédiat avec « réduire les animations », focus sur la cible en option (pastilles de catégories, sommaire et titres des pages légales) |

Les clés d'activité sont écrites une seule fois : `ACTIVITY_KEYS` (`utils/activities.ts`, dans l'ordre d'affichage), d'où découlent le type `ActivityType`, `isActivity`, les enums de `content.schemas.ts` et les tests. Tout ce qui décrit une activité (libellés, icône, menu, carte d'accueil, section de `/activites`) est dans son fichier de contenu ; `useActivities` les lit et les trie (`orderActivities`). Ajouter une activité : voir [CONTENT.md](CONTENT.md#ajouter-une-activité).

Les clés ne sont pas dans le dossier `shared/` de Nuxt : le build serveur y laisse un import relatif calculé depuis `.nuxt`, faux quand le dossier de build est dans `node_modules/.cache`, et `generate` échoue.

### Fonctions pures

Les règles qui méritent un test vivent dans `app/utils/`, sans dépendance à Nuxt : composants et composables les appellent, Vitest les importe directement ([TESTING.md](TESTING.md)). Nuxt les auto-importe ; leur nom ne doit pas reprendre celui d'une variable locale courante ni commencer par `use`.

| Module              | Fonctions                                                                                                                                    | Utilisé par                                                                             |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `seo.ts`            | `seoKeyFromPath`, `buildCanonicalUrl`, `buildSeoMeta`, `toAbsoluteUrl`                                                                       | `app.vue`, `useSeo`                                                                     |
| `event.ts`          | `isUpcomingEvent`, `eventBannerId`                                                                                                           | `useNextEvent`                                                                          |
| `cdn.ts`            | `resolveCdnUrl`, `CDN_IMAGE_WIDTHS`, `CDN_IMAGE_LAYOUTS`, `cdnImagePath`, `cdnSrcset`                                                        | `useCdnAsset`, `scripts/cdn-build.ts`                                                   |
| `stat.ts`           | `parseStatValue`                                                                                                                             | `HomeStatCounter`                                                                       |
| `accessibility.ts`  | `defaultAccessibility`, `parseAccessibility` (valeur du `localStorage` illisible ou inconnue : options par défaut)                           | `useAccessibility`                                                                      |
| `anchor.ts`         | `toAnchorId`                                                                                                                                 | Documents, FAQ, `SharedCategoryChips`                                                   |
| `gallery.ts`        | `galleryTypes`, `filterGallery`, `hasGalleryHeroLayout`, `galleryFallbackPath`                                                               | galerie                                                                                 |
| `labels.ts`         | `fillLabel`, `countLabel`                                                                                                                    | composants qui affichent un libellé du contenu                                          |
| `contact.ts`        | `mapUrls`                                                                                                                                    | `useClub`                                                                               |
| `navigation.ts`     | `sortHeaderLinks`                                                                                                                            | `useNavigation`                                                                         |
| `activities.ts`     | `ACTIVITY_KEYS`, `isActivity`, `orderActivities`, `adjacentActivities`, `ACTIVITY_CSS_VAR`, `activityColor`, `activityTint`, `activityClass` | `useActivities`, `ActiviteHero`, tout composant teinté par activité                     |
| `category-color.ts` | `categoryColorClasses`, `categoryTextClass`                                                                                                  | `useCategoryColor`                                                                      |
| `motion.ts`         | `prefersReducedMotion` (lit `matchMedia`, non testé par Vitest)                                                                              | `HomeStatCounter`, `HomeHero`, `ActiviteCarousel`, `ColorModeButton`, `useSmoothScroll` |
| `sections.ts`       | `isBandSection`                                                                                                                              | `ActivitePage`, `/activites`                                                            |
| `llms.ts`           | `buildLlmsText`                                                                                                                              | `server/routes/llms.txt.ts`                                                             |
| `goals.ts`          | `GOAL_SEPARATOR`, `linkLabel`, `pageGoalName`, `goalName`                                                                                    | `plugins/link-goals.client.ts`                                                          |

Une chaîne écrite dans `app/` est lue par Tailwind comme une classe potentielle : un `!mot` (négation) peut générer une classe `!important` inutile.

## Chargement du contenu

- Chaque page ou composant lit sa collection avec `await useAsyncData('<clé>', () => queryCollection('<collection>').first())` (ou `.where('stem', '=', …)` pour un fichier d'une collection à plusieurs fichiers : activité ; `.path('/<slug>')` pour une page légale, dont la source a le préfixe `/` ; `.select(…).all()` pour la liste des activités). Au `generate`, la requête s'exécute pendant le prérendu et le résultat est écrit dans le payload de la page ; dans le navigateur, une navigation interne relit les données sous `/__nuxt_content/`.
- **Une clé = une requête** : deux appels avec la même clé partagent le même résultat (`rejoindre` est lu par la page et par les redirections, `galerie` par la galerie et par les derniers albums de l'accueil, `seo` par `useSeo` et par `HomeHero` via `useNuxtData('seo')`). Ne jamais réutiliser une clé pour une autre requête.
- Les clés en place : `seo`, `navigation`, `club`, `labels`, `partners`, `nextEvent`, `qr`, `cta`, `home`, `galerie`, `documents`, `faq`, `contact`, `rejoindre`, `redirects`, `activites-index`, `activites` (liste commune : menu, icônes, libellés), `home-activites` (cartes de l'accueil), `activites-sections` (sections de `/activites`), la clé de l'activité (`tandem`…) et le slug d'une page légale.
- Un composable qui en appelle un autre lance les deux requêtes ensemble (`Promise.all`) : appelé après un `await`, un composable perd le contexte Nuxt (erreur E1001). Dans un `<script setup>`, les `await` successifs restent sûrs.
- Nuxt Content **ne valide pas** les données contre le schéma : il les enregistre telles quelles (un nombre reste un nombre là où le schéma attend du texte). Le schéma sert aux types et aux colonnes SQL ; la validation est faite par les tests de contenu ([TESTING.md](TESTING.md)).
- Base de Content : SQLite (`.data/content/contents.db`, connecteur natif), reconstruite à chaque build, jamais versionnée.

## SEO

- `app.vue` appelle `useSeo` avec une clé tirée du chemin : `/` → `index`, sinon le chemin sans `/` initial, les `/` remplacés par `-` (`/activites/tandem` → `activites-tandem`). Une page dont le fichier de contenu porte ses propres options SEO l'appelle aussi, avec ces options (`useSeo(clé, options)`) : `LegalPage` (titre et description du front-matter), `RedirectPage` pour une option de « Nous rejoindre » (`title`, `description`, `ogImage`). Appelée après celle d'`app.vue`, sa déclaration l'emporte dans Unhead et disparaît avec la page.
- `useSeo` fusionne `seo.yml` (`defaults` puis `pages.<clé>`), puis les options de la page (`buildSeoMeta`, une valeur vide est ignorée) : titre « {page} - Efrei Para » (accueil : nom seul), description, OpenGraph, Twitter, `robots` (page, sinon `defaults.robots`, sinon `index, follow`), `lang`, `theme-color`, lien canonique (`baseUrl` + chemin, `activites-` redevient `activites/`).
- Images OpenGraph dans `public/seo/`. `baseUrl` est écrit dans `seo.yml` : le canonique pointe toujours vers la production, quel que soit l'environnement.
- Seule l'accueil est destinée aux moteurs de recherche : `seo.yml` met `noindex, follow` par défaut (`index, follow` sur `index`). `public/robots.txt` n'interdit rien : une page bloquée ne serait pas lue, sa balise `noindex` non plus, et les robots d'aperçu (LinkedIn, X) ne verraient ni la page ni son image.
- `og:image` et `twitter:image` sont rendues absolues (`toAbsoluteUrl`, `baseUrl` + chemin) au moment d'écrire les balises.
- `/llms.txt` ([llms.txt](https://llmstxt.org)) : `server/routes/llms.txt.ts` lit les collections avec `queryCollection(event, …)` (importé de `@nuxt/content/server`) et les passe à `buildLlmsText` (`app/utils/llms.ts`), qui écrit le Markdown : intitulés et textes du contenu, liens rendus absolus avec `baseUrl` de `seo.yml`, sections facultatives absentes omises, événement repris seulement s'il est à venir au `generate`. Servi en `text/plain`, UTF-8 (`charset` de nginx), cache d'une heure comme les autres `.txt`.
- Icônes du navigateur déclarées dans `app.head.link` de `nuxt.config.ts` : `favicon.ico` (16 à 48 px) et `apple-touch-icon.png` (180 px).

## Mesure d'audience

- `@nuxtjs/plausible` (configuré dans `nuxt.config.ts`) envoie les pages vues et, avec `autoOutboundTracking`, l'événement `Outbound Link: Click` (propriété `url`) pour un lien externe.
- `plugins/link-goals.client.ts` écoute `click` et `auxclick` (bouton du milieu) sur `document`, en phase de capture : chemin et titre de l'onglet sont encore ceux de la page quittée. Pour un `a[href]`, il envoie l'événement `<portée> › <lien>` par `$plausible.trackEvent` (rien n'est envoyé si Plausible est désactivé ou l'hôte ignoré). Un lien externe envoie donc deux événements.
- Portée : la valeur de l'ancêtre `[data-goal-zone]` (en-tête ; menu déroulant des activités et fenêtre du menu mobile, téléportés hors du `<header>`, la fenêtre par `menu.content` de `UHeader` ; bannière ; pied de page ; libellés de `labels.goalZones`), sinon le nom de la page (`pageGoalName`, `utils/goals.ts`) : `goal` de `seo.yml`, sinon le titre de l'onglet sans « - Efrei Para » (pages légales, redirections, erreurs).
- Lien (`linkLabel`) : `data-goal-title` du lien, sinon texte d'un élément `[data-goal-title]` à l'intérieur (titre d'une carte d'album ou de document, d'une activité du menu déroulant), sinon `aria-label`, sinon texte visible ; espaces repliés, coupé à 60 caractères.

## CDN

`useCdnAsset().buildCdnUrl(chemin)` (règle : `resolveCdnUrl`) renvoie `CDN_URL` + chemin (chaîne vide si `CDN_URL` est absent). En développement seulement, si `CDN_DEV_TOKEN` est défini, il ajoute `?token=…` pour passer la protection anti-hotlink ; le jeton n'est injecté dans `runtimeConfig.public` qu'en `NODE_ENV=development`. Les photos passent par `cdnImage(base, emplacement)` : `src` en 960, `srcset` des largeurs utiles et `sizes` de l'emplacement (`CDN_IMAGE_LAYOUTS`) ; sans `CDN_URL`, ni `srcset` ni `sizes`. La vidéo d'accueil passe aussi par `buildCdnUrl` (deux `<source>`, AV1 puis H.264) ; sans `CDN_URL`, elle n'est pas affichée. Les noms de fichiers attendus sur le CDN sont dans [CONTENT.md](CONTENT.md#fichiers-du-cdn).

## Icônes

- `icon.fallbackToApi: false` : aucune icône n'est chargée à l'exécution. Le bundle client contient les icônes trouvées par le scan de `app/**/*.{vue,ts}`, `content/**/*.{yml,md}` et `nuxt.config.ts`, plus les collections maison (`includeCustomCollections`). Une icône écrite ailleurs, ou construite par concaténation, n'est pas embarquée.
- Les icônes génériques de Nuxt UI sont remplacées par leurs équivalents Tabler dans `nuxt.config.ts` (`appConfig.ui.icons`) ; elles se lisent avec `useAppConfig().ui.icons.*`, fusionnées avec `app.config.ts`.
- Collections maison : un dossier de SVG par préfixe dans `app/assets/icons/`, déclaré dans `icon.customCollections`.

## Génération et prérendu

- `bun run generate` prérend toutes les pages trouvées en suivant les liens, plus les redirections, qu'aucun lien n'atteint : `nitro.prerender.routes` les reçoit de `redirectRoutes()` (`content.routes.ts`), qui lit `redirects.yml › socials` et les options de `rejoindre.yml`. Une redirection ajoutée au contenu est donc prérendue sans toucher au code ; une autre page sans lien entrant s'ajoute à cette liste.
- `/llms.txt` n'a pas de lien entrant : il est ajouté à `nitro.prerender.routes` et écrit en fichier dans la sortie.
- `/about` (ancienne page À propos) est redirigée vers l'accueil par `routeRules` ; prérendue (`nitro.prerender.routes`), elle devient une page `meta refresh`.
- `failOnError: false` : une page en erreur est absente de la sortie sans faire échouer le build ; relire le journal du `generate` ([TESTING.md](TESTING.md)).
- Sortie dans `.output/public` (lien `dist`).
- Le numéro de version du pied de page vient de `package.json`, lu au build dans `nuxt.config.ts` (`appConfig.version`) : seule cette chaîne est embarquée dans le site.
- Vite (Rolldown + Oxc) : `console` et `debugger` retirés, commentaires légaux supprimés, CSS minifiée. `vite.optimizeDeps.include` liste des dépendances à pré-bundler en dev pour éviter les rechargements.
- Le plugin `rehype-target-blank.mjs` (alias `rehype-target-blank`) s'applique au Markdown de Content (pages légales).

## Conteneurisation

### Dockerfile

- **Étape build** : `oven/bun:1.4-alpine`, `bun install --frozen-lockfile`, build args `CDN_URL`, `PLAUSIBLE_URL`, `PLAUSIBLE_DOMAIN` passés en variables d'environnement, puis `bun run generate`.
- **Étape service** : `nginxinc/nginx-unprivileged:alpine-slim`, utilisateur `101`, port **8080**. Les templates `nginx/*.conf.template` sont copiés dans `/etc/nginx/templates/` : au démarrage, l'image remplace `${CDN_URL}` et `${PLAUSIBLE_URL}` (gardés en `ENV`) et écrit le résultat dans `conf.d/`. Seul `.output/public` est copié dans la racine web. `HEALTHCHECK` : `wget` sur `/` toutes les 30 s.
- `.dockerignore` exclut git, dépendances, sorties de build, rapports de test et d'audit, fichiers Claude Code, `assets/` (bannière du README) et `cdn/` (médias du CDN). `.env`, `.env.*` (sauf `.env.example`), journaux et `.DS_Store` sont exclus à toute profondeur (`**/`).
- `bun run docker:build` construit l'image en local à partir du `.env`, chargé par `set -a && . ./.env` (commentaires acceptés).

### nginx

`default.conf.template` :

| Chemin                            | Cache                                                         |
| --------------------------------- | ------------------------------------------------------------- |
| `/_nuxt/builds/` (noms stables)   | `no-cache` (manifeste de version)                             |
| `/_nuxt/` (noms hachés)           | `public, max-age=31536000, immutable`                         |
| `/__nuxt_content/` (noms stables) | `no-cache`                                                    |
| polices `.woff` / `.woff2`        | `public, max-age=31536000, immutable` (renommer pour changer) |
| autres fichiers statiques         | `public, max-age=3600`                                        |
| pages HTML (`/`)                  | `no-cache`, `try_files $uri $uri/index.html $uri.html =404`   |

- Vraie 404 : `error_page 404 /404.html` ; un 403 est rendu comme une 404. Les chemins commençant par `.` sont refusés, avant toute autre règle.
- gzip activé, `server_tokens off`. Redirections de dossier relatives (`absolute_redirect off`, `port_in_redirect off`) : elles ne reprennent ni l'hôte demandé ni le port 8080.
- `security-headers.conf.template` contient tous les en-têtes de sécurité ; nginx n'héritant pas des `add_header` dans un `location` qui en déclare, **chaque `location` qui pose un en-tête ré-inclut ce fichier**. Contenu détaillé : [SECURITY.md](SECURITY.md#4-csp-et-origines-externes).

## Variables d'environnement

Lues au build (sauf mention). Liste commentée dans [`.env.example`](../.env.example) et le README.

| Variable           | Usage                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------- |
| `CDN_URL`          | `runtimeConfig.public.cdnUrl` ; au démarrage du conteneur, CSP `img-src` et `media-src` |
| `CDN_DEV_TOKEN`    | Développement uniquement : jeton anti-hotlink du CDN                                    |
| `PLAUSIBLE_URL`    | Instance Plausible ; au démarrage du conteneur, CSP `connect-src`                       |
| `PLAUSIBLE_DOMAIN` | Domaine déclaré à Plausible                                                             |

Toute nouvelle variable est ajoutée à `.env.example`, au README et, si elle sert au build Docker, aux `ARG` du `Dockerfile` et au script `docker:build`.

## Environnements et déploiement

- `bun run dev` : développement local sur `http://localhost:3000`, sans Docker.
- `bun run preview` : sert le site généré (`.output/public`) sur `http://127.0.0.1:4173` avec les règles de nginx, par `tests/e2e/serve.ts`, sans les en-têtes de sécurité (vérifiés dans le conteneur).
- Chaque push déclenche une construction de l'image Docker et sa mise en ligne : la branche **`dev`** alimente la préproduction, **`main`** la production. On travaille sur `dev` ; `main` ne reçoit que ce qui est prêt à publier.
- Pas de CI dans le dépôt : lint et vérifications sont faits en local ([TESTING.md](TESTING.md)).
