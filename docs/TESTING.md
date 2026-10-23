# Efrei Para — Tests et vérifications

> **Périmètre** : stratégie de test, organisation des tests, vérifications à faire avant de livrer.
> **À mettre à jour** dès qu'un outil de test, l'organisation de `tests/`, un script ou la liste des contrôles change.

## Stratégie

- **Vitest** pour la **logique pure** de `app/utils/` et des plugins, et pour le **contenu** (`content/`). Environnement `node`, **sans Nuxt** ([`vitest.config.ts`](../vitest.config.ts)) : ni auto-imports, ni composables, ni composants.
- Conséquence sur le code : une règle qui mérite un test (calcul, tri, filtre, règle d'affichage) est écrite comme une fonction pure dans `app/utils/`, puis appelée par le composant ou le composable ([ARCHITECTURE.md](ARCHITECTURE.md#fonctions-pures)). Une règle enfouie dans un composant n'est pas testable ici.
- Pas de tests de composants.
- Nuxt Content ne valide pas le contenu contre ses schémas au build : ce sont les tests de contenu qui le font, avec les icônes, les liens et la cohérence ([CONTENT.md](CONTENT.md#vérifier-le-contenu)).
- Pas de script `typecheck` ni de CI : les vérifications se font en local.

## Organisation

- `tests/unit/<module>.test.ts` : un fichier par module testé, imports relatifs (`../../app/utils/…`).
- `tests/content/` : `schemas`, `icons`, `links` (liens internes et SEO), `coherence` (clés d'activité, redirections, accessibilité). Lecture des fichiers et liste des routes dans `helpers.ts` ; les schémas viennent de `content.schemas.ts`, les routes sont déduites de `app/pages/` et du contenu.
- Un `describe` par fonction, cas décrits en français.

## Ce qui doit être testé

- clé SEO, canonique et fusion des métadonnées (`seo`) ;
- affichage et clé de fermeture de la bannière d'événement (`event`) ;
- adresse CDN et jeton de développement (`cdn`) ;
- valeur des statistiques animées (`stat`), ancres de catégories (`anchor`) ;
- filtre, tri et mise en avant de la galerie (`gallery`) ;
- liens de l'en-tête (`navigation`), activité précédente / suivante (`activities`), couleurs de catégorie (`category-color`) ;
- plugin `rehype-target-blank` ;
- contenu : schémas, icônes, liens internes, entrées SEO, clés d'activité, redirections.

Une correction de bogue dans une de ces zones s'accompagne d'un test qui échouait avant.

## Commandes

```bash
bun run test         # tests Vitest (logique pure et contenu)
bun run test:watch   # mode interactif
```

## Vérifications avant de livrer

Dans cet ordre, tout doit passer :

```bash
bun run lint
bun run test
bun run generate     # relire le journal : les erreurs de prérendu ne font pas échouer le build
bun run preview      # parcourir le site généré
bun run docker:build # quand le Dockerfile, nginx, les variables ou les dépendances changent
```

- **`generate`** : avec `failOnError: false`, une page qui plante au prérendu disparaît de `.output/public` sans erreur de sortie. Vérifier l'absence d'erreur dans le journal et la présence des pages touchées (dont les redirections, prérendues par la liste `nitro.prerender.routes`).
- **Icônes** : une icône non trouvée au scan n'apparaît pas dans le site généré (pas de repli par API) ; contrôler visuellement les icônes ajoutées.
- **CSP** : une nouvelle origine externe se vérifie dans le conteneur (`docker:build` puis lancement), car `bun dev` et `preview` n'appliquent pas les en-têtes nginx.
- `bun run format` après une modification (Markdown compris).

## Vérification de l'interface

Un changement visible se vérifie dans un vrai navigateur :

- en **clair et en sombre** ;
- sur une largeur de **téléphone** et de **desktop** (le menu bascule à `lg`) ;
- avec les options **Police dyslexique** et **Contraste élevé** quand la typographie ou les couleurs changent ;
- pour une page d'activité, sur au moins deux activités (teintes, sections facultatives absentes).
