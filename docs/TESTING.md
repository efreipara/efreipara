# Efrei Para — Tests et vérifications

> **Périmètre** : stratégie de test et vérifications à faire avant de livrer.
> **À mettre à jour** dès qu'un outil de test, un script de vérification ou la liste des contrôles change.

## Stratégie

- **Aucun test automatisé** aujourd'hui (ni unitaire, ni de composant, ni end-to-end), **pas de script `typecheck`** et pas de CI : la qualité repose sur le lint, le typage vérifié par l'éditeur, la génération complète du site et un contrôle visuel.
- Le schéma Zod de chaque collection valide le contenu à chaque build : une donnée invalide fait échouer `dev` et `generate`.
- Si des tests sont ajoutés, ils viseront d'abord la logique pure (règle d'affichage de la bannière, clé SEO tirée du chemin, `buildCdnUrl`, analyse des statistiques), extraite des composants pour être testable ; ce document décrira alors l'outil et l'organisation.

## Vérifications avant de livrer

Dans cet ordre, tout doit passer :

```bash
bun run lint
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
