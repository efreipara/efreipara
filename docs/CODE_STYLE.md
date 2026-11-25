# Efrei Para — Style de code

> **Périmètre** : conventions d'écriture du code, outils de formatage et de lint, format des commits.
> **À mettre à jour** dès qu'une convention, la configuration Prettier / ESLint ou le format des commits change.
> L'organisation des dossiers est dans [ARCHITECTURE.md](ARCHITECTURE.md), les règles visuelles dans [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

## Langues

- **Interface en français** : libellés, `aria-label`, messages d'erreur. Le texte visible va dans `content/<langue>/` ([CONTENT.md](CONTENT.md#principe)) ; le code ne nomme jamais une langue (`useT`, `LOCALES`).
- **URL et clés de contenu en français** : routes (`/activites`, `/rejoindre`, `/galerie`), clés d'activité (`soufflerie`), dossier `components/activite/`, champs YAML proches du domaine.
- **Code en anglais** : variables, fonctions, types, composables (`useNextEvent`, `buildCdnUrl`, `ActivityType`).
- **Commentaires en français**, rares : ils expliquent un choix ou une contrainte non évidente (contournement, ordre imposé, piège d'une bibliothèque), pas ce que le code dit déjà.

## Vue et TypeScript

- Composants en `<script setup lang="ts">`, script et style indentés dans le bloc (Prettier `vueIndentScriptAndStyle`).
- Props typées par `defineProps<{ … }>()` (avec `withDefaults` si besoin), événements par `defineEmits<{ … }>()`.
- Templates : composants en `PascalCase`, toutes les balises sans contenu auto-fermantes (`<UIcon … />`, `<img … />`).
- Composants rangés par zone dans `components/<zone>/`, nommés sans répéter la zone (`activite/Hero.vue` → `<ActiviteHero>`).
- Composables : un fichier `useXxx.ts` dans `app/composables/`, `export const useXxx = () => { … }`, qui renvoie un objet. Les types partagés sont exportés du module qui les porte (`ActivityType` depuis `app/utils/activities.ts`).
- Logique testable (calcul, tri, filtre, règle d'affichage) : une fonction pure dans `app/utils/`, appelée par le composant ([ARCHITECTURE.md](ARCHITECTURE.md#fonctions-pures)).
- Texte et données du contenu : `const { t } = await useT('<collection>')` puis **`t.cle.sous.cle`** pour le texte principal du fichier ; `useContentData` quand il faut la ref ; jamais `queryCollection` directement ([ARCHITECTURE.md](ARCHITECTURE.md#chargement-du-contenu)). Les champs facultatifs se lisent avec `?.` et un repli.
- Variables inutilisées interdites ; un argument volontairement ignoré commence par `_`.

## Icônes, couleurs et classes

- Icône Nuxt UI générique : `appConfig.ui.icons.<nom>` ; icône propre au site : un champ `icon` dans le fichier de contenu de la page ou du composant qui l'affiche ; icône d'activité : `getIcon(type)` de `useActivities()` ; icône d'un réseau : `getSocial(key).icon` de `useClub()`. Écrire un nom `tabler:*` en dur seulement quand aucune entrée n'existe, et toujours en entier (scan des icônes).
- Couleurs sémantiques Nuxt UI plutôt que des teintes Tailwind ; teinte d'activité par `color-mix` ([DESIGN_SYSTEM.md](DESIGN_SYSTEM.md#teinte-dactivité)).
- Une classe Tailwind construite dynamiquement doit apparaître **en entier** quelque part dans les fichiers scannés, sinon elle n'est pas générée (voir le commentaire en tête de `app/utils/category-color.ts`).
- L'ordre des classes est fixé par `prettier-plugin-tailwindcss`.
- Pour personnaliser un composant Nuxt UI, passer par sa prop `ui` (ou `app.config.ts` pour un réglage global) plutôt que surcharger son CSS.

## Formatage et lint

- **Prettier** ([`.prettierrc.json`](../.prettierrc.json)) : sans point-virgule, guillemets simples, virgules finales, 100 colonnes, `htmlWhitespaceSensitivity: ignore`, plugin Tailwind. `bun run format` formate tout le dépôt, Markdown compris, sauf les fichiers de `.gitignore` et de [`.prettierignore`](../.prettierignore) (`.claude/skills/` et `.claude/references/`, code tiers repris sans modification). VS Code formate à l'enregistrement (`.vscode/settings.json`).
- **ESLint** ([`eslint.config.mjs`](../eslint.config.mjs)) : configuration `@nuxt/eslint`, plus balises auto-fermantes partout, composants en `PascalCase` dans les templates, variables inutilisées et `v-html` en erreur (le Markdown du contenu passe par `<MDC>`, voir [SECURITY.md](SECURITY.md#2-html-issu-du-contenu)). `.claude/skills/` est exclu : ce code tiers est repris sans modification ([README des skills](../.claude/skills/README.md)). `bun run lint`, `bun run lint:fix`.

## Commits

- Format **Conventional Commits en français** : `type(scope): description` au présent ou à l'infinitif, en minuscules, sans point final.
  - Types : `feat`, `fix`, `perf`, `build`, `refactor`, `style`, `test`, `docs`, `ci`, `chore`, choisis d'après l'effet sur le site livré ; leur sens et leur effet sur la version sont dans le tableau de la section « Versions » de [`CLAUDE.md`](../CLAUDE.md#versions). `style` ne désigne que la mise en forme du code : un changement d'apparence est un `feat` ou un `fix`.
  - Scope : la zone touchée, au singulier ou tel qu'en usage : `header`, `footer`, `activites`, `galerie`, `documents`, `faq`, `rejoindre`, `contact`, `qr`, `mainhero`, `content`, `icons`, `nginx`, `dockerfile`, `nuxt`, `readme`… ; `build(bun): mise à jour des dépendances` quand une dépendance du site change, `chore(bun)` quand seul l'outillage de dev change.
- Un commit = une étape cohérente ; la documentation concernée est mise à jour dans le même commit.
- Le type du commit décide de l'impact sur la version (SemVer, `package.json`, `CHANGELOG.md`, tag `vX.Y.Z`) : règle dans la section « Versions » de [`CLAUDE.md`](../CLAUDE.md#versions).
- On travaille sur `dev` ; `main` correspond à la production ([ARCHITECTURE.md](ARCHITECTURE.md#environnements-et-déploiement)).
