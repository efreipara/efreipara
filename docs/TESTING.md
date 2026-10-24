# Efrei Para — Tests et vérifications

> **Périmètre** : stratégie de test, organisation des tests, vérifications à faire avant de livrer.
> **À mettre à jour** dès qu'un outil de test, l'organisation de `tests/`, un script ou la liste des contrôles change.

## Stratégie

- **Vitest** pour la **logique pure** de `app/utils/` et des plugins, et pour le **contenu** (`content/`). Environnement `node`, **sans Nuxt** ([`vitest.config.ts`](../vitest.config.ts)) : ni auto-imports, ni composables, ni composants.
- Conséquence sur le code : une règle qui mérite un test (calcul, tri, filtre, règle d'affichage) est écrite comme une fonction pure dans `app/utils/`, puis appelée par le composant ou le composable ([ARCHITECTURE.md](ARCHITECTURE.md#fonctions-pures)). Une règle enfouie dans un composant n'est pas testable ici.
- **Playwright** pour le **site généré** : pages, erreurs, redirections, interactions et audit d'accessibilité (axe), sur Brave, en desktop et en mobile. Les composants sont testés à travers les pages, pas isolément.
- Nuxt Content ne valide pas le contenu contre ses schémas au build : ce sont les tests de contenu qui le font, avec les icônes, les liens et la cohérence ([CONTENT.md](CONTENT.md#vérifier-le-contenu)).
- Pas de script `typecheck` ni de CI : les vérifications se font en local.

## Organisation

- `tests/unit/<module>.test.ts` : un fichier par module testé, imports relatifs (`../../app/utils/…`).
- `tests/content/` : `schemas`, `icons`, `links` (liens internes et SEO), `coherence` (clés d'activité, redirections, accessibilité). Lecture des fichiers et liste des routes dans `helpers.ts` ; les schémas viennent de `content.schemas.ts`, les routes sont déduites de `app/pages/` et du contenu.
- `tests/e2e/` : `pages`, `redirects`, `interactions`, `a11y`, plus :
  - `fixtures.ts` : coupe toute requête hors du site (CDN, Plausible, albums, réseaux), relève les erreurs console, et `gotoReady` attend l'hydratation de Vue avant d'interagir ;
  - `serve.ts` : sert `.output/public` avec les règles de nginx (`try_files`, vraie 404) ;
  - `routes.ts` : la liste des pages, la même que celle des tests de contenu ;
  - `a11y-known.ts` : les violations graves déjà présentes, par règle et par page.
- Un `describe` par fonction (Vitest) ou par sujet (Playwright), cas décrits en français.

## Ce qui doit être testé

- clé SEO, canonique et fusion des métadonnées (`seo`) ;
- affichage et clé de fermeture de la bannière d'événement (`event`) ;
- adresse CDN et jeton de développement (`cdn`) ;
- valeur des statistiques animées (`stat`), ancres de catégories (`anchor`) ;
- filtre, tri et mise en avant de la galerie (`gallery`) ;
- liens de l'en-tête (`navigation`), activité précédente / suivante et teinte d’activité (`activities`), couleurs de catégorie (`category-color`) ;
- plugin `rehype-target-blank` ;
- contenu : schémas, icônes, liens internes, entrées SEO, clés d'activité, redirections ;
- site généré : chaque page répond sans erreur console, avec titre et canonique ; 404 ; redirections ; menus desktop et mobile ; thème ; options d'accessibilité (dont `no-contrast`) ; réglage « réduire les animations » (compteurs, carrousel immobile, saut direct des pastilles) ; filtres de la galerie ; FAQ ; ancres (dont l'arrêt du défilement à la molette, par un vrai geste Chromium `Input.synthesizeScrollGesture` : `mouse.wheel` ne reproduit pas le cas) ; sections facultatives des activités ;
- accessibilité : axe sur chaque page, en clair et en sombre. Une violation `serious` ou `critical` absente de `a11y-known.ts` fait échouer le test. Corriger une violation connue retire sa ligne de la liste.

Une correction de bogue dans une de ces zones s'accompagne d'un test qui échouait avant.

## Commandes

```bash
bun run test         # tests Vitest (logique pure et contenu)
bun run test:watch   # mode interactif
bun run test:e2e     # tests Playwright, sur le site déjà généré (headless)
bun run test:e2e:headed  # les mêmes dans une fenêtre Brave visible, ralentis (PW_SLOWMO=400)
bun run test:all     # generate, puis test, puis test:e2e
```

- Navigateur des tests Playwright : `PLAYWRIGHT_BROWSER_PATH` s'il est défini, sinon **Brave** (`/Applications/Brave Browser.app`), sinon le Chromium de Playwright, à installer une fois avec `bunx playwright install chromium`.
- `test:e2e` sert le dernier `generate` : relancer `generate` après une modification, ou utiliser `test:all`.
- En cas d'échec : `bunx playwright show-report` (rapport HTML, traces des tests en échec).

## Vérifications avant de livrer

Dans cet ordre, tout doit passer :

```bash
bun run lint
bun run test
bun run generate     # relire le journal : les erreurs de prérendu ne font pas échouer le build
bun run test:e2e
bun run docker:build # quand le Dockerfile, nginx, les variables ou les dépendances changent
```

- **`generate`** : avec `failOnError: false`, une page qui plante au prérendu disparaît de `.output/public` sans erreur de sortie. Vérifier l'absence d'erreur dans le journal et la présence des pages touchées (dont les redirections, prérendues par la liste `nitro.prerender.routes`).
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
