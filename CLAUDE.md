# CLAUDE.md — Efrei Para

Site vitrine du club de parachutisme de l'Efrei ([efreipara.fr](https://efreipara.fr)).
Site **statique** généré par Nuxt (`nuxt generate`), servi par nginx dans Docker. Pas de serveur applicatif, pas d'API, pas de base de données.
Tout le texte vient de `content/` (Nuxt Content) ; photos et vidéo sont sur un CDN. **Le dépôt GitHub est public.**

## Documentation du projet

La documentation est découpée par usage dans `docs/`. **Lire le ou les documents qui concernent la tâche avant de commencer**, pas tout le dossier.

| Document                                         | Contenu                                                          | À lire avant de…                                                   |
| ------------------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| [`docs/PRD.md`](docs/PRD.md)                     | Ce que fait le site : pages, sections, comportements visibles    | modifier ou ajouter une page, une section, un comportement         |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)   | Stack, organisation du code, SEO, CDN, génération, Docker, nginx | toucher à `nuxt.config.ts`, un composable, le build, le conteneur  |
| [`docs/CONTENT.md`](docs/CONTENT.md)             | Collections, champs, formats, fichiers attendus sur le CDN       | modifier `content/`, `content.config.ts`, ajouter une activité     |
| [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | Thème, couleurs, polices, icônes, composants réutilisables       | toucher à l'interface                                              |
| [`docs/SECURITY.md`](docs/SECURITY.md)           | Modèle de menace, invariants (secrets, `v-html`, CSP, dépôt)     | ajouter une variable, un `v-html`, une origine externe, un en-tête |
| [`docs/CODE_STYLE.md`](docs/CODE_STYLE.md)       | Conventions de code, Prettier, ESLint, format des commits        | écrire du code ou un commit                                        |
| [`docs/TESTING.md`](docs/TESTING.md)             | Vérifications avant de livrer                                    | terminer une livraison                                             |

Installation et variables d'environnement : `README.md` ; historique des versions : `CHANGELOG.md`.

### Documentation à jour (obligatoire)

**Toute modification qui change ce qu'un document décrit met à jour ce document dans le même commit.** Une tâche n'est pas terminée tant que la documentation ne reflète pas le code.

| Ce qui est modifié                                                        | Document à mettre à jour     |
| ------------------------------------------------------------------------- | ---------------------------- |
| Page, section, comportement visible, bannière, redirection, accessibilité | `docs/PRD.md`                |
| Module, composable, `nuxt.config.ts`, organisation du code, Docker, nginx | `docs/ARCHITECTURE.md`       |
| `content.config.ts`, collection, champ, format, nommage des images du CDN | `docs/CONTENT.md`            |
| Couleur, police, icône, règle visuelle, composant réutilisable            | `docs/DESIGN_SYSTEM.md`      |
| Secret, `v-html`, origine externe, CSP, en-tête, image Docker             | `docs/SECURITY.md`           |
| Convention, Prettier, ESLint, format des commits                          | `docs/CODE_STYLE.md`         |
| Outil de test, script ou liste de vérifications                           | `docs/TESTING.md`            |
| Variable d'environnement, installation, édition de contenu                | `README.md` + `.env.example` |

- Chaque information n'est écrite qu'à **un seul endroit** ; les autres documents y renvoient par un lien.
- Les documents décrivent l'**état actuel** : corriger le texte existant, ne pas ajouter de note datée (l'historique va dans `CHANGELOG.md`).
- Un `refactor`, `style` ou `chore` qui ne change rien à ce qui est décrit ne touche pas la documentation.
- `docs/` est public : jamais d'adresse de préproduction, d'hébergeur, d'IP ni de chemin de déploiement ([SECURITY.md](docs/SECURITY.md#7-dépôt-public)).
- En fin de réponse, indiquer les documents mis à jour (ou « documentation inchangée »).

## Stack

- Paquets et build : **Bun**
- Framework : **Nuxt 4** + **Vue 3** (`<script setup lang="ts">`), TypeScript
- UI : **Nuxt UI 4** + **Tailwind CSS 4**, thème clair et sombre
- Contenu : **Nuxt Content 3** (YAML / Markdown, schémas Zod)
- Icônes : `@nuxt/icon` (Tabler, Simple Icons, collections maison), embarquées au build
- Audience : **Plausible**
- Service : **nginx** non-root dans **Docker**
- Qualité : **ESLint** (`@nuxt/eslint`), **Prettier**

## Documentation et MCP

Les serveurs MCP **Nuxt** et **Nuxt UI** sont disponibles. Les utiliser systématiquement :

- avant d'utiliser un composant Nuxt UI (props, slots, exemples) : `search-components`, `get-component`, `get-example` ;
- pour les icônes : `search-icons` ;
- pour la configuration Nuxt, Nuxt Content, les modules, le prérendu : outils du MCP Nuxt.

Ne jamais supposer une API de mémoire quand le MCP peut la confirmer : les versions évoluent vite (Nuxt, Nuxt UI, Nuxt Content, Tailwind).

## Skills

Les skills du dépôt (`.claude/skills/`) s'utilisent selon la demande. Charger le skill avant de commencer, sans attendre qu'il soit nommé.

| Demande                                                                   | Skill                          |
| ------------------------------------------------------------------------- | ------------------------------ |
| Créer ou modifier une page, une section, un composant ; accessibilité     | `frontend-ui-engineering`      |
| Finition visuelle, animation, transition, micro-interaction               | `emil-design-eng`              |
| Geste, glisser, carrousel, interaction tactile, ressort                   | `apple-design`                 |
| Bug dont la cause n'est pas évidente, `dev`, `generate` ou build en échec | `debugging-and-error-recovery` |
| Lenteur, Core Web Vitals, poids des images ou de la vidéo                 | `performance-optimization`     |
| Fin d'une livraison `feat`, avant le dernier commit                       | `code-review-and-quality`      |
| Demande floue, où plusieurs interprétations changent le résultat          | `interview-me`                 |

- Uniquement sur demande explicite : `code-simplification`, `security-and-hardening`.
- Un skill s'applique à la tâche en cours : ignorer ses consignes d'accueil ou de présentation.
- **La documentation du projet prime sur un skill** : composants Nuxt UI et règles de `docs/DESIGN_SYSTEM.md` (formes arrondies, teintes d'activité, polices comprises), invariants de `docs/SECURITY.md`, vérifications de `docs/TESTING.md`. Un skill ne justifie ni nouvelle dépendance (React, Motion / Framer Motion…) ni écart à ces règles ; ses exemples React se transposent en Vue, Nuxt UI et CSS / WAAPI.
- Une petite modification (libellé, style, correction évidente) ne charge aucun skill.
- En fin de réponse, indiquer les skills utilisés (ou « aucun skill »).

## Conventions

Détail dans [`docs/CODE_STYLE.md`](docs/CODE_STYLE.md). L'essentiel :

- **Interface 100 % en français** ; le texte visible va dans `content/`, pas dans les composants.
- Code en anglais, URL et clés de contenu en français, **commentaires en français et rares**.
- Préférer les composants Nuxt UI aux composants maison ; réutiliser les composants listés dans `docs/DESIGN_SYSTEM.md`.
- Icônes via `appConfig` quand une entrée existe ; teintes d'activité par `color-mix`.
- `v-html` uniquement après `DOMPurify.sanitize()` ; toute nouvelle origine externe ajoutée à la CSP nginx.

## Commits

- Commiter l'avancement au fil de l'eau (une étape cohérente = un commit), au format Conventional Commits en français (`feat(scope): …`, `fix(scope): …`, `docs(scope): …`, `chore(bun): …`).
- Travailler sur `dev` ; `main` est la production.
- **Jamais de push. Jamais de ligne `Co-Authored-By`** ni autre mention de Claude dans les messages de commit.
- `CLAUDE.md` et `.claude/` (skills) sont versionnés : une modification des conventions ou des skills se commite comme le reste.
- Jamais commités : `CLAUDE.local.md`, `.claude/settings.local.json` et tout fichier ignoré par git (ne jamais forcer un `git add -f`).
- Ne pas inclure dans un commit des modifications du dépôt qu'on n'a pas faites soi-même.

## Versions

- Versionnage **SemVer** ; source unique : le champ `version` de `package.json`.
- **À chaque commit, évaluer l'impact sur la version** d'après son type :
  - `feat` → version **mineure** (1.1.0 → 1.2.0) ;
  - `fix` ou `perf` visible par le visiteur → version **corrective** (1.1.0 → 1.1.1) ;
  - changement incompatible (adresse publique supprimée ou renommée, `!` dans le type) → version **majeure** ;
  - `docs`, `refactor`, `style`, `chore`, `test` sans effet visible → version inchangée.
  - Une modification de contenu visible (`feat(content)`, `fix(content)`) compte comme le reste.
- **Une version par livraison** : quand une demande produit plusieurs commits, incrémenter une seule fois, dans le **dernier commit du lot**, au niveau le plus haut des commits du lot. Ce commit met à jour `package.json` **et** `CHANGELOG.md` (entrée datée, rubriques « Ajouts », « Modifications », « Corrections », en français, rédigées pour un visiteur ou un membre du bureau).
- Poser ensuite un **tag git local annoté** `vX.Y.Z` sur ce commit, sur `dev` (`git tag -a vX.Y.Z -m "Efrei Para X.Y.Z"`). Jamais de push : les tags partent avec `git push --follow-tags`.
- En fin de réponse, indiquer la nouvelle version (ou « version inchangée »).

## Commandes

```bash
bun install
bun dev               # développement sur http://localhost:3000
bun run lint          # ESLint (lint:fix pour corriger)
bun run test          # Vitest : logique pure
bun run format        # Prettier sur tout le dépôt
bun run generate      # génère le site statique dans .output/public
bun run preview       # sert le site généré
bun run docker:build  # image Docker à partir du .env
```

## Façon de travailler

- Faire ce qui est demandé, sans anticiper ce qui est listé « hors périmètre » dans `docs/PRD.md`.
- En fin de livraison : les vérifications de `docs/TESTING.md` doivent passer, puis résumer ce qui a été fait et ce qui reste.
- Si une règle de la documentation pose un problème technique, **le signaler et proposer une alternative avant de dévier**.
