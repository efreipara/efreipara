# Efrei Para — Tests et vérifications

> **Périmètre** : stratégie de test, organisation des tests, vérifications à faire avant de livrer.
> **À mettre à jour** dès qu'un outil de test, l'organisation de `tests/`, un script ou la liste des contrôles change.

## Stratégie

- **Vitest** pour la **logique pure** de `app/utils/` et des plugins, et pour le **contenu** (`content/`). Environnement `node`, **sans Nuxt** ([`vitest.config.ts`](../vitest.config.ts)) : ni auto-imports, ni composables, ni composants.
- Conséquence sur le code : une règle qui mérite un test (calcul, tri, filtre, règle d'affichage) est écrite comme une fonction pure dans `app/utils/`, puis appelée par le composant ou le composable ([ARCHITECTURE.md](ARCHITECTURE.md#fonctions-pures)). Une règle enfouie dans un composant n'est pas testable ici.
- **Playwright** pour le **site généré** : pages, erreurs, redirections, interactions et audit d'accessibilité (axe), sur Brave, en desktop et en mobile. Les composants sont testés à travers les pages, pas isolément.
- Nuxt Content ne valide pas le contenu contre ses schémas au build : ce sont les tests de contenu qui le font, avec les icônes, les liens et la cohérence ([CONTENT.md](CONTENT.md#vérifier-le-contenu)).
- Types vérifiés par `vue-tsc` (`bun run typecheck`). Pas de CI : les vérifications se font en local.

## Organisation

- `tests/unit/<module>.test.ts` : un fichier par module testé, imports relatifs (`../../app/utils/…`).
- `tests/content/` : `schemas` (chaque langue de `LOCALES`), `translations` (structure et données des fichiers traduits), `icons`, `links` (liens internes et SEO, par langue), `coherence` (fichiers d'activité, options d'accessibilité, réseaux de l'en-tête), `llms` (`/llms.txt` construit à partir des vrais fichiers). Lecture des fichiers (relatifs au dossier d'une langue, le français par défaut) et liste des routes dans `helpers.ts` ; les schémas viennent de `content.schemas.ts`, les routes sont déduites de `app/pages/` et du contenu.
- `tests/e2e/` : `pages`, `redirects`, `interactions`, `a11y` (pages des deux langues : langue, `hreflang`, canonique), `i18n` (bouton de langue, liens traduits, page légale en repli), `goals` (noms des événements Plausible de chaque lien, comparés à [`docs/plausible/goals.txt`](plausible/README.md) ; les pages anglaises doivent donner des noms déjà listés), plus :
  - `fixtures.ts` : coupe toute requête hors du site (CDN, Plausible, albums, réseaux), relève les erreurs console, et `gotoReady` attend l'hydratation de Vue avant d'interagir ;
  - `serve.ts` : sert `.output/public` avec les règles de nginx (`try_files`, vraie 404), sur `127.0.0.1` seulement ; c'est aussi `bun run preview` ;
  - `routes.ts` : la liste des pages de chaque langue, la même que celle des tests de contenu, et les redirections de `content.routes.ts` ;
  - `a11y-known.ts` : les violations graves déjà présentes, par règle et par page.
- Un `describe` par fonction (Vitest) ou par sujet (Playwright), cas décrits en français.

## Ce qui doit être testé

- clé SEO, canonique, fusion des métadonnées et URL absolue des images de partage (`seo`) ;
- événements (`event`) : à venir (jour fixé ou fin du dernier mois possible), tri, filtre par activité, choix de l'événement de la bannière, dates en toutes lettres, phrase de la bannière, clé de fermeture ; schéma : `date` ou `months`, jamais les deux ni aucun ;
- adresse CDN et jeton de développement, chemins et `srcset` des photos (`cdn`) ;
- chaque export de `app/utils/` et `app/composables/` est vu par l'import automatique de Nuxt (`auto-imports`) : un export manqué ne casse pas le build, seulement le rendu (« … is not defined », erreur 500 à la génération) ;
- valeur des statistiques animées (`stat`), ancres de catégories (`anchor`) ;
- lecture des options d'accessibilité enregistrées, valeur illisible ou inconnue comprise (`accessibility`) ;
- filtre, tri et mise en avant de la galerie (`gallery`) ;
- libellés à compléter et compteurs (`labels`), liens d'itinéraire (`contact`), liens de l'en-tête (`navigation`), activité précédente / suivante et teinte d’activité (`activities`), couleurs de catégorie (`category-color`), alternance des bandes de section (`sections`) ;
- Markdown de `/llms.txt` : ordre des activités, libellés remplis, sections facultatives omises, liens absolus, événements à venir listés, passés masqués (`llms`) ;
- plugin `rehype-target-blank` ;
- contenu : schémas, icônes, liens internes, SEO de chaque page (dans `seo.yml` ou dans son fichier, jamais aux deux endroits), fichiers d'activité ;
- site généré : chaque page répond sans erreur console, avec titre et canonique ; `/llms.txt` servi en texte avec chaque activité ; 404 ; redirections et raccourcis d'activité ; menus desktop et mobile ; thème ; options d'accessibilité (dont `no-contrast`) ; réglage « réduire les animations » (compteurs, carrousel immobile, vidéo d'accueil à l'arrêt, saut direct des pastilles) ; filtres de la galerie ; FAQ ; sommaire des pages légales (défilement sans `#`, immédiat avec « réduire les animations ») ; ancres (dont l'arrêt du défilement à la molette, par un vrai geste Chromium `Input.synthesizeScrollGesture` : `mouse.wheel` ne reproduit pas le cas) ; sections facultatives des activités ; événements, horloge du navigateur figée autour du premier événement daté du contenu : bannière et sections jusqu'au jour même, retirés le lendemain sans nouveau `generate` (`events.spec.ts`) ; comportement d'application (texte non sélectionnable sauf zones `select-text`, pas de menu contextuel sur les images, menu du lien sur une image dans un lien) ;
- événements Plausible : nom d'un lien (`data-goal-title`, `aria-label`, texte), nom de la page (`goal` de `seo.yml`, titre de l'onglet) (`goals`) ; liste de tous les noms à jour avec les liens du site généré (`goals.spec.ts`) ;
- accessibilité : axe sur chaque page, en clair et en sombre. Une violation `serious` ou `critical` absente de `a11y-known.ts` fait échouer le test, de même que `heading-order` (ordre des titres, « moderate » pour axe). Corriger une violation connue retire sa ligne de la liste.

Une correction de bogue dans une de ces zones s'accompagne d'un test qui échouait avant.

## Commandes

```bash
bun run test         # tests Vitest (logique pure et contenu)
bun run test:watch   # mode interactif
bun run test:e2e     # tests Playwright, sur le site déjà généré (headless)
bun run test:e2e:headed  # les mêmes dans une fenêtre Brave visible, ralentis (PW_SLOWMO=400)
bun run test:all     # generate, puis test, puis test:e2e
bun run goals        # réécrit docs/plausible/goals.txt et goals-console.js d'après le site généré
```

- Navigateur des tests Playwright : `PLAYWRIGHT_BROWSER_PATH` s'il est défini, sinon **Brave** (`/Applications/Brave Browser.app`), sinon le Chromium de Playwright, à installer une fois avec `bunx playwright install chromium`.
- `test:e2e` sert le dernier `generate` : relancer `generate` après une modification, ou utiliser `test:all`.
- En cas d'échec : `bunx playwright show-report` (rapport HTML, traces des tests en échec).

## Vérifications avant de livrer

Dans cet ordre, tout doit passer :

```bash
bun run lint
bun run typecheck
bun run test
bun run generate     # relire le journal : les erreurs de prérendu ne font pas échouer le build
bun run test:e2e
bun run docker:build # quand le Dockerfile, nginx, les variables ou les dépendances changent
```

- **`generate`** : avec `failOnError: false`, une page qui plante au prérendu disparaît de `.output/public` sans erreur de sortie. Vérifier l'absence d'erreur dans le journal et la présence des pages touchées (dont les redirections, prérendues d'après le contenu par `redirectRoutes()`).
- **Icônes** : les tests de contenu vérifient chaque nom d'icône écrit en entier ; une icône construite par concaténation leur échappe et se contrôle à l'œil.
- **CSP et en-têtes** : les tests Playwright n'appliquent pas les en-têtes nginx. Une nouvelle origine externe ou un en-tête se vérifie dans le conteneur (`docker:build` puis lancement).
- `bun run format` après une modification (Markdown compris).

## Vérification de l'interface

Un changement visible se vérifie dans un vrai navigateur :

- en **clair et en sombre** ;
- sur une largeur de **téléphone** et de **desktop** (le menu bascule à `lg`) ;
- avec les options **Police dyslexique** et **Contraste élevé** quand la typographie ou les couleurs changent ;
- pour une page d'activité, sur au moins deux activités (teintes, sections facultatives absentes).

## Vérification par Claude dans le navigateur

Pour un changement visible, Claude vérifie la page dans **Brave, en fenêtre visible** : l'utilisateur voit chaque clic et chaque changement en direct. Le mode headless ne s'utilise que sur demande.

- **Avec le serveur MCP Playwright** (`.mcp.json`, chargé au démarrage d'une session ouverte dans le projet, après approbation) : fenêtre visible, chaque action est un appel distinct. Profil temporaire en mémoire (`--isolated`) ; captures dans `test-results/mcp/`.
- **Sans le MCP** : un script `playwright-core` (fourni par `@playwright/test`) écrit dans le scratchpad de la session, avec `chromium.launch({ executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser', headless: false, slowMo: 400 })` et un contexte neuf.
- **Jamais** le profil Brave de l'utilisateur, et jamais son serveur : un `bun dev` déjà lancé sur le port 3000 n'est ni arrêté ni réutilisé. Claude sert la page sur un port à part : `bun tests/e2e/serve.ts` (4173, site généré, après `generate`) ou `bun dev --port 3001`.

Déroulé :

1. servir la page sur un port à part (ci-dessus) ;
2. l'ouvrir à 390 px puis à 1280 px de large, en clair puis en sombre, et refaire les interactions touchées ;
3. lire la console et faire une capture des états touchés ;
4. résumer ce qui a été vu dans la réponse.
