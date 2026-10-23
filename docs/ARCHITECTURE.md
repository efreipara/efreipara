# Efrei Para — Architecture

> **Périmètre** : comment le site est construit — stack, organisation du code, chargement du contenu, SEO, CDN, génération, conteneur et déploiement.
> **À mettre à jour** dès qu'un module, un composable, l'organisation des dossiers, `nuxt.config.ts`, le `Dockerfile`, la configuration nginx, une variable d'environnement ou le déploiement change.
> Le comportement attendu est dans [PRD.md](PRD.md), le modèle de contenu dans [CONTENT.md](CONTENT.md), les règles de sécurité dans [SECURITY.md](SECURITY.md).

## Stack

| Sujet            | Décision                                                                          |
| ---------------- | --------------------------------------------------------------------------------- |
| Paquets et build | **Bun** (`bun.lock`)                                                              |
| Framework        | **Nuxt 4** + Vue 3 (`<script setup lang="ts">`) + TypeScript                      |
| UI               | **Nuxt UI 4** + **Tailwind CSS 4**, thème clair et sombre                         |
| Contenu          | **Nuxt Content 3** : collections YAML / Markdown typées par Zod                   |
| Rendu            | **Site statique** généré par `nuxt generate` (SSR au build, aucun serveur Node)   |
| Service          | **nginx** (image non-root) dans Docker                                            |
| Images et vidéo  | CDN externe (`CDN_URL`), servi derrière Cloudflare                                |
| Polices          | `@nuxt/fonts`, fichiers locaux dans `public/`                                     |
| Icônes           | `@nuxt/icon` : Tabler, Simple Icons et collections maison, embarquées au build    |
| Audience         | Plausible (`@nuxtjs/plausible`), instance auto-hébergée (`PLAUSIBLE_URL`)         |
| HTML du contenu  | `marked` (Markdown de la FAQ) + `isomorphic-dompurify` (nettoyage avant `v-html`) |
| Qualité          | ESLint (`@nuxt/eslint`) + Prettier (plugin Tailwind)                              |

`typescript` est bloqué en `6.0.x` (commentaire dans `package.json`) tant que `typescript-eslint` ne gère pas TS 7. `@nuxt/image` est installé et configuré (domaine et alias `cdn`) mais aucun composant ne l'utilise : les images sont des `<img>` simples.

### Contraintes structurantes

- **Aucun serveur à l'exécution** : pas de dossier `server/`, pas d'API, pas de base de données, pas de cookie. Tout ce qui dépend de la configuration (`runtimeConfig`, variables d'environnement, contenu) est figé au moment du `generate` : changer une valeur impose de reconstruire.
- **SSR obligatoire** (`ssr: true`) : Nuxt Content interroge sa base SQLite pendant le prérendu, et chaque page est écrite en HTML complet avec son payload.
- **Interactivité côté navigateur uniquement** : bannière d'événement (`ClientOnly`), accessibilité, thème, filtres de la galerie, compteurs animés, redirections.
- **Appels externes limités** au CDN, à Plausible et aux miniatures des albums (Efrei Picture Studio) ; polices et icônes sont servies par le site. Toute nouvelle origine doit d'abord être ajoutée à la CSP ([SECURITY.md](SECURITY.md#4-csp-et-origines-externes)).

## Organisation du code

```
app/
├── app.vue           # racine : bannière, en-tête, page, pied ; classes d'accessibilité ; useSeo
├── app.config.ts     # couleurs Nuxt UI, registre d'icônes, teintes d'activité, réseaux, contact
├── error.vue         # page d'erreur (messages en français)
├── assets/
│   ├── css/main.css  # Tailwind + Nuxt UI, palette navy, couleurs, utilitaires, accessibilité
│   ├── icons/        # collections d'icônes maison (efreipara, efrei, ifly, creativecommons)
│   └── images/       # avion.svg, qr.svg, main-hero.jpg (affiche de la vidéo)
├── components/       # rangés par zone : activite/, app/, header/, home/, legal/, redirect/, shared/
├── composables/      # useXxx.ts (contenu partagé, SEO, CDN, accessibilité…)
├── pages/            # routes (noms en français)
└── utils/            # fonctions pures, sans Nuxt, testées par Vitest
content/
├── global/           # données communes à plusieurs pages (navigation, SEO, CTA, partenaires, événement)
└── pages/            # une source par page ; activites/ et legal/ en plusieurs fichiers
content.schemas.ts    # source et schéma Zod de chaque collection (importés aussi par les tests)
content.config.ts     # déclare les collections (defineCollection) à partir de content.schemas.ts
nuxt.config.ts        # modules, icônes, polices, Content, Plausible, prérendu, minification
rehype-target-blank.mjs  # plugin Markdown : liens externes en nouvel onglet
public/               # polices, favicon, robots.txt, images OpenGraph (seo/), logos partenaires
nginx/                # templates de configuration (serveur, en-têtes de sécurité)
tests/                # unit/ et content/ (Vitest), e2e/ (Playwright) : voir TESTING.md
.mcp.json             # serveurs MCP du projet (Playwright sur Brave, pour Claude Code)
Dockerfile            # build Bun puis service nginx
```

### Composants

Nuxt importe les composants automatiquement en préfixant le nom du dossier : `components/activite/Hero.vue` s'utilise en `<ActiviteHero>`, `components/shared/PageHero.vue` en `<SharedPageHero>`. Le rôle de chacun est dans [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md#composants-réutilisables).

- `app/` : cadre de toutes les pages (en-tête, pied, bannière d'événement).
- `activite/` : sections d'une page d'activité, assemblées par `ActivitePage`.
- `legal/`, `redirect/` : rendu des routes servies par `pages/[page].vue`.
- `shared/` : blocs réutilisés par plusieurs pages.

### Routes

| Fichier                                                                                      | Routes                                                                                                                                                      |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pages/index.vue`                                                                            | `/`                                                                                                                                                         |
| `pages/activites/index.vue`                                                                  | `/activites`                                                                                                                                                |
| `pages/activites/[activite].vue`                                                             | `/activites/oa`, `/tandem`, `/soufflerie`, `/pac` (`validate` : autre clé → 404)                                                                            |
| `pages/[page].vue`                                                                           | redirections (`discord`, `instagram`, `devenir-membre`, `rejoindre-bureau`) et pages légales (`mentions-legales`, `rgpd`, `reglement`) ; autre valeur → 404 |
| `pages/galerie.vue`, `documents.vue`, `faq.vue`, `rejoindre.vue`, `contact.vue`, `about.vue` | page du même nom                                                                                                                                            |
| `pages/qr.vue`                                                                               | `/qr`, sans layout (`definePageMeta({ layout: false })`) : `app.vue` masque bannière, en-tête et pied via `useLayout()`                                     |

### Composables

| Composable                                         | Rôle                                                                                                                                                  |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useNavigation`                                    | Collection `navigation` : liens de l'en-tête (triés par `header`), du pied, accessibilité                                                             |
| `usePartners`                                      | Collection `partners`, filtre par activité                                                                                                            |
| `useNextEvent`, `useEventIcon`, `useActivityColor` | (`useActivities.ts`) prochain événement et règle d'affichage, icône d'une activité ; type `ActivityType`. `useActivityColor` n'est utilisé nulle part |
| `useSocials`                                       | Liste des réseaux depuis `app.config.ts` (`socials`), recherche d'URL et d'icône par nom                                                              |
| `useSeo`                                           | Métadonnées d'une page depuis `seo.yml`                                                                                                               |
| `useCdnAsset`                                      | `buildCdnUrl(chemin)` : adresse complète sur le CDN (appelle `resolveCdnUrl` avec la config)                                                          |
| `useCategoryColor`                                 | Classes Tailwind d'une couleur de catégorie (Documents, FAQ)                                                                                          |
| `useAccessibility`                                 | Options d'accessibilité : état partagé, `localStorage`, classes sur `<html>`                                                                          |

`ActivityType` (`'oa' | 'tandem' | 'soufflerie' | 'pac'`) est déclaré dans `useActivities.ts` ; la même liste est aussi écrite dans `content.schemas.ts` (enums), `pages/activites/[activite].vue`, `utils/activities.ts` (`ACTIVITY_ORDER`), `app.config.ts` et dans la table `activityCssVar` de chaque composant qui teinte par activité. Ajouter une activité : voir [CONTENT.md](CONTENT.md#ajouter-une-activité).

### Fonctions pures

Les règles qui méritent un test vivent dans `app/utils/`, sans dépendance à Nuxt : composants et composables les appellent, Vitest les importe directement ([TESTING.md](TESTING.md)). Nuxt les auto-importe ; leur nom ne doit pas reprendre celui d'une variable locale courante ni commencer par `use`.

| Module              | Fonctions                                                                      | Utilisé par                           |
| ------------------- | ------------------------------------------------------------------------------ | ------------------------------------- |
| `seo.ts`            | `seoKeyFromPath`, `buildCanonicalUrl`, `buildSeoMeta`                          | `app.vue`, `useSeo`                   |
| `event.ts`          | `isUpcomingEvent`, `eventBannerId`                                             | `useNextEvent`                        |
| `cdn.ts`            | `resolveCdnUrl`                                                                | `useCdnAsset`                         |
| `stat.ts`           | `parseStatValue`                                                               | `HomeStatCounter`                     |
| `anchor.ts`         | `toAnchorId`                                                                   | Documents, FAQ, `SharedCategoryChips` |
| `gallery.ts`        | `galleryTypes`, `filterGallery`, `hasGalleryHeroLayout`, `galleryFallbackPath` | galerie                               |
| `navigation.ts`     | `sortHeaderLinks`                                                              | `useNavigation`                       |
| `activities.ts`     | `ACTIVITY_ORDER`, `adjacentActivities`                                         | `ActiviteHero`                        |
| `category-color.ts` | `categoryColorClasses`                                                         | `useCategoryColor`                    |
| `motion.ts`         | `prefersReducedMotion` (lit `matchMedia`, non testé par Vitest)                | `HomeStatCounter`, `ColorModeButton`  |

Une chaîne écrite dans `app/` est lue par Tailwind comme une classe potentielle : un `!mot` (négation) peut générer une classe `!important` inutile.

## Chargement du contenu

- Chaque page ou composant lit sa collection avec `await useAsyncData('<clé>', () => queryCollection('<collection>').first())` (ou `.where('stem', '=', …)` pour les collections à plusieurs fichiers : activités, pages légales). Au `generate`, la requête s'exécute pendant le prérendu et le résultat est écrit dans le payload de la page ; dans le navigateur, une navigation interne relit les données sous `/__nuxt_content/`.
- **Une clé = une requête** : deux appels avec la même clé partagent le même résultat (`rejoindre` est lu par la page et par les redirections, `seo` par `useSeo` et par `HomeHero` via `useNuxtData('seo')`). Ne jamais réutiliser une clé pour une autre requête.
- Les clés en place : `seo`, `navigation`, `partners`, `nextEvent`, `cta`, `home`, `galerie`, `documents`, `faq`, `contact`, `rejoindre`, `redirects`, `activites-index`, la clé de l'activité (`tandem`…), `<activité>-nav` (liens précédent / suivant) et le slug d'une page légale.
- Nuxt Content **ne valide pas** les données contre le schéma : il les enregistre telles quelles (un nombre reste un nombre là où le schéma attend du texte). Le schéma sert aux types et aux colonnes SQL ; la validation est faite par les tests de contenu ([TESTING.md](TESTING.md)).
- Base de Content : SQLite (`.data/content/contents.db`, connecteur natif), reconstruite à chaque build, jamais versionnée.

## SEO

- `app.vue` appelle `useSeo` avec une clé tirée du chemin : `/` → `index`, sinon le chemin sans `/` initial, les `/` remplacés par `-` (`/activites/tandem` → `activites-tandem`). `LegalPage` l'appelle aussi avec son slug.
- `useSeo` fusionne `seo.yml` (`defaults` puis `pages.<clé>`) : titre « {page} - Efrei Para » (accueil : nom seul), description, OpenGraph, Twitter, `robots` (défaut `index, follow`), `lang`, `theme-color`, lien canonique (`baseUrl` + chemin, `activites-` redevient `activites/`).
- Images OpenGraph dans `public/seo/`. `baseUrl` est écrit dans `seo.yml` : le canonique pointe toujours vers la production, quel que soit l'environnement.
- `public/robots.txt` n'autorise aujourd'hui que la racine.

## CDN

`useCdnAsset().buildCdnUrl(chemin)` (règle : `resolveCdnUrl`) renvoie `CDN_URL` + chemin (chaîne vide si `CDN_URL` est absent). En développement seulement, si `CDN_DEV_TOKEN` est défini, il ajoute `?token=…` pour passer la protection anti-hotlink ; le jeton n'est injecté dans `runtimeConfig.public` qu'en `NODE_ENV=development`. La vidéo d'accueil lit `runtimeConfig.public.cdnUrl` directement. Les noms de fichiers attendus sur le CDN sont dans [CONTENT.md](CONTENT.md#fichiers-du-cdn).

## Icônes

- `icon.fallbackToApi: false` : aucune icône n'est chargée à l'exécution. Le bundle client contient les icônes trouvées par le scan de `app/**/*.{vue,ts}`, `content/**/*.{yml,md}` et `nuxt.config.ts`, plus les collections maison (`includeCustomCollections`). Une icône écrite ailleurs, ou construite par concaténation, n'est pas embarquée.
- Les icônes génériques de Nuxt UI sont remplacées par leurs équivalents Tabler dans `nuxt.config.ts` (`appConfig.ui.icons`) ; elles se lisent avec `useAppConfig().ui.icons.*`, fusionnées avec `app.config.ts`.
- Collections maison : un dossier de SVG par préfixe dans `app/assets/icons/`, déclaré dans `icon.customCollections`.

## Génération et prérendu

- `bun run generate` prérend toutes les pages trouvées en suivant les liens, plus les routes sans lien entrant listées dans `nitro.prerender.routes` (`/devenir-membre`, `/discord`, `/instagram`, `/rejoindre-bureau`). Une nouvelle page qu'aucun lien n'atteint doit y être ajoutée.
- `failOnError: false` : une page en erreur est absente de la sortie sans faire échouer le build ; relire le journal du `generate` ([TESTING.md](TESTING.md)).
- Sortie dans `.output/public` (lien `dist`).
- Vite (Rolldown + Oxc) : `console` et `debugger` retirés, commentaires légaux supprimés, CSS minifiée. `vite.optimizeDeps.include` liste des dépendances à pré-bundler en dev pour éviter les rechargements.
- Le plugin `rehype-target-blank.mjs` (alias `rehype-target-blank`) s'applique au Markdown de Content (pages légales).

## Conteneurisation

### Dockerfile

- **Étape build** : `oven/bun:1.4-alpine`, `bun install --frozen-lockfile`, build args `CDN_URL`, `PLAUSIBLE_URL`, `PLAUSIBLE_DOMAIN`, `NUXT_PUBLIC_SITE_URL` passés en variables d'environnement, puis `bun run generate`.
- **Étape service** : `nginxinc/nginx-unprivileged:alpine-slim`, utilisateur `101`, port **8080**. Les templates `nginx/*.conf.template` sont copiés dans `/etc/nginx/templates/` : au démarrage, l'image remplace `${CDN_URL}` et `${PLAUSIBLE_URL}` (gardés en `ENV`) et écrit le résultat dans `conf.d/`. Seul `.output/public` est copié dans la racine web.
- `.dockerignore` exclut git, dépendances, sorties de build, `.env` et `assets/` (bannière du README).
- `bun run docker:build` construit l'image en local à partir du `.env`.

### nginx

`default.conf.template` :

| Chemin                            | Cache                                                         |
| --------------------------------- | ------------------------------------------------------------- |
| `/_nuxt/` (noms hachés)           | `public, max-age=31536000, immutable`                         |
| `/__nuxt_content/` (noms stables) | `no-cache`                                                    |
| polices `.woff` / `.woff2`        | `public, max-age=31536000, immutable` (renommer pour changer) |
| autres fichiers statiques         | `public, max-age=3600`                                        |
| pages HTML (`/`)                  | `no-cache`, `try_files $uri $uri/index.html $uri.html =404`   |

- Vraie 404 : `error_page 404 /404.html` ; un 403 est rendu comme une 404. Les chemins commençant par `.` sont refusés, avant toute autre règle.
- gzip activé, `server_tokens off`.
- `security-headers.conf.template` contient tous les en-têtes de sécurité ; nginx n'héritant pas des `add_header` dans un `location` qui en déclare, **chaque `location` qui pose un en-tête ré-inclut ce fichier**. Contenu détaillé : [SECURITY.md](SECURITY.md#4-csp-et-origines-externes).

## Variables d'environnement

Lues au build (sauf mention). Liste commentée dans [`.env.example`](../.env.example) et le README.

| Variable               | Usage                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `CDN_URL`              | `runtimeConfig.public.cdnUrl`, domaine de `@nuxt/image` ; au démarrage du conteneur, CSP `img-src` et `media-src` |
| `CDN_DEV_TOKEN`        | Développement uniquement : jeton anti-hotlink du CDN                                                              |
| `PLAUSIBLE_URL`        | Instance Plausible ; au démarrage du conteneur, CSP `connect-src`                                                 |
| `PLAUSIBLE_DOMAIN`     | Domaine déclaré à Plausible                                                                                       |
| `NUXT_PUBLIC_SITE_URL` | Passée en build arg, lue par aucun code aujourd'hui (le canonique vient de `seo.yml`)                             |

Toute nouvelle variable est ajoutée à `.env.example`, au README et, si elle sert au build Docker, aux `ARG` du `Dockerfile` et au script `docker:build`.

## Environnements et déploiement

- `bun run dev` : développement local sur `http://localhost:3000`, sans Docker.
- Chaque push déclenche une construction de l'image Docker et sa mise en ligne : la branche **`dev`** alimente la préproduction, **`main`** la production. On travaille sur `dev` ; `main` ne reçoit que ce qui est prêt à publier.
- Pas de CI dans le dépôt : lint et vérifications sont faits en local ([TESTING.md](TESTING.md)).
