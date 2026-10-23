# Efrei Para — Contenu

> **Périmètre** : modèle de contenu — collections Nuxt Content, fichiers sources, champs, formats acceptés, fichiers attendus sur le CDN.
> **À mettre à jour** dès qu'une collection, un schéma de `content.schemas.ts`, une convention de nommage d'image ou la règle « texte dans `content/` » change.
> L'usage de chaque page est dans [PRD.md](PRD.md), le chargement des données dans [ARCHITECTURE.md](ARCHITECTURE.md#chargement-du-contenu).

## Principe

Le texte visible du site vit dans `content/` (YAML et Markdown), pas dans les composants : un membre du bureau doit pouvoir changer une phrase, une FAQ ou un album sans toucher au code. Chaque fichier correspond à une **collection** déclarée dans [`content.config.ts`](../content.config.ts), avec sa source et son schéma Zod dans [`content.schemas.ts`](../content.schemas.ts). Nuxt Content ne vérifie pas le schéma au build : c'est `bun run test` qui le fait, avec d'autres contrôles (voir [Vérifier le contenu](#vérifier-le-contenu)).

Ce qui n'est pas dans `content/` :

- **`app/app.config.ts`** : URL des réseaux sociaux, e-mail et adresse du club, liens cartographiques, e-mail du mainteneur, registre d'icônes et teintes d'activité.
- **Libellés encore écrits dans le code** : boutons du hero de l'accueil (« Nos activités », « Nous rejoindre »), « En savoir plus » et « Inscription » (cartes et bannière), titres des sections d'activité (« Pourquoi choisir … ? », « Comment ça se passe ? », « Prérequis », « Nos partenaires »), libellés des types de la galerie (`typeLabel` de `galerie.vue`), « Tout voir », compteurs (« docs », « questions »), boutons de `SharedHelpCta`, messages d'erreur (`error.vue`), pied de page (licences), page À propos.

Un nouveau texte va dans `content/` ; un libellé du code déplacé vers le contenu met à jour cette liste.

## Collections

| Collection       | Type | Source                           | Utilisée par                                          |
| ---------------- | ---- | -------------------------------- | ----------------------------------------------------- |
| `navigation`     | data | `global/navigation.yml`          | en-tête, pied de page, menu d'accessibilité           |
| `seo`            | data | `global/seo.yml`                 | toutes les pages (`useSeo`), phrase du hero d'accueil |
| `cta`            | data | `global/cta.yml`                 | appel à l'action en bas de page                       |
| `partners`       | data | `global/partners.yml`            | accueil, pages d'activité                             |
| `nextEvent`      | data | `global/next-event.yml`          | bannière d'événement                                  |
| `home`           | data | `pages/home.yml`                 | `/`                                                   |
| `activitesIndex` | data | `pages/activites.yml`            | `/activites`                                          |
| `activites`      | data | `pages/activites/<activité>.yml` | `/activites/<activité>`                               |
| `galerie`        | data | `pages/galerie.yml`              | `/galerie`                                            |
| `documents`      | data | `pages/documents.yml`            | `/documents`                                          |
| `faq`            | data | `pages/faq.yml`                  | `/faq`                                                |
| `rejoindre`      | data | `pages/rejoindre.yml`            | `/rejoindre`, `/devenir-membre`, `/rejoindre-bureau`  |
| `contact`        | data | `pages/contact.yml`              | `/contact`                                            |
| `redirects`      | data | `pages/redirects.yml`            | pages de redirection                                  |
| `legal`          | page | `pages/legal/<slug>.md`          | `/mentions-legales`, `/reglement`, `/rgpd`            |

### Points notables par collection

- **`navigation`** : `pages[]` alimente la colonne Club du pied de page ; une page avec un champ `header` (nombre) apparaît aussi dans l'en-tête, triée par ce nombre. `activities[].slot` est une clé d'activité. `accessibility[].key` doit correspondre à une option de `useAccessibility` (`dyslexic`, `highContrast`). `legal[]` peut contenir un lien externe (`target: _blank`).
- **`seo`** : `pages` est indexé par la clé de route (voir [ARCHITECTURE.md](ARCHITECTURE.md#seo)) : une nouvelle page ajoute son entrée (`title`, `description`, `ogImage` et `robots` facultatifs). `pages.index.description` est aussi la phrase du hero d'accueil.
- **`nextEvent`** : un seul événement (`title`, `date` `AAAA-MM-JJ`, `type` = clé d'activité, `url` du formulaire). La bannière disparaît d'elle-même après la date.
- **`partners`** : `icon` (icône d'une collection, ex. `ifly:logo-color`) ou `logo` (fichier de `public/`, ex. `/partners/skydive-event.webp`) ; `activites` liste les pages d'activité où le partenaire apparaît (l'accueil les montre tous).
- **`home`** : `stats[].title` commence par le nombre à animer, le reste est un suffixe (`100+`). `activites.items[].type` et `why[].type` donnent la teinte.
- **`activites`** : un fichier par activité, nommé par sa clé (`tandem.yml`…), retrouvé par son `stem` (`pages/activites/tandem`). Seuls `title`, `description`, `label` et `alt` sont obligatoires ; `intro`, `stats`, `features`, `steps`, `requirements` sont facultatifs et leur section disparaît s'ils sont absents. `imageCount` = nombre de photos du carrousel sur le CDN (0 ou absent : pas de carrousel).
- **`galerie`** : `items[]` avec `title`, `type` (clé d'activité), `date` (`AAAA-MM-JJ`, sert au tri et à la photo de repli), `location`, `url` de l'album, `photo` (URL de la couverture, facultative) et `source` (nom du site, affiché dans « Voir l'album sur … »). L'ordre du fichier est indifférent.
- **`documents`** : catégories (`name`, `description`, `icon`, `color`) et documents (`title`, `description`, `url`, `icon`, `type` : `internal` pour une page du site, `external` sinon).
- **`faq`** : catégories (`name`, `questions[]`) ; une question a `question`, `answer`, `icon` (l'icône de la première question sert aussi d'icône à la catégorie) et des `buttons` facultatifs (`label`, `to`, `icon`, `variant`, `target`). Le fichier donne aussi un `color` aux catégories, que le schéma ne déclare pas ; la page le lit malgré tout.
- **`documents`, `faq`** : `color` vaut `blue`, `green`, `purple`, `red`, `orange` ou `gray` (`useCategoryColor`) ; autre valeur ou absence → couleur primaire. `helpcta.buttons` ⊂ `discord`, `instagram`, `github`.
- **`rejoindre`** : `options[].slug` (`devenir-membre`, `rejoindre-bureau`) est à la fois le nom de la route de redirection et celui de la photo sur le CDN ; `link` est le formulaire externe ; `color` et `why.features[].class` sont des classes `text-efreipara-<activité>` dont seule la clé d'activité est lue.
- **`redirects`** : textes des pages de redirection ; les cibles viennent de `app.config.ts` (Discord, Instagram) ou de `rejoindre.options[].link`.
- **`legal`** : front-matter `title`, `description`, `updatedAt` (`AAAA-MM-JJ`, facultatif, affiché en bas de page), puis le texte en Markdown.

## Formats acceptés

| Champ                                              | Format                                                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `home.about.paragraphs[]`, `activites.<…>.intro[]` | HTML simple (`<b class="text-highlighted">…</b>`), nettoyé par DOMPurify avant affichage |
| `faq.categories[].questions[].answer`              | Markdown (`marked`, retours à la ligne conservés), nettoyé par DOMPurify                 |
| `pages/legal/*.md`                                 | Markdown Nuxt Content ; liens externes ouverts dans un nouvel onglet                     |
| tous les autres champs texte                       | texte brut (échappé par Vue)                                                             |

Règle de sécurité associée : [SECURITY.md](SECURITY.md#2-html-issu-du-contenu).

## Icônes

Toute valeur `icon` est un nom `prefixe:nom` d'une collection embarquée :

- `tabler:*` — icônes générales ([liste](https://icon-sets.iconify.design/tabler/)) ;
- `simple-icons:*` — logos de marques ;
- `efreipara:*` (`logo`, `logo-color`, `efreipara`, `parachute`), `efrei:*`, `ifly:*`, `creativecommons:*` — SVG de `app/assets/icons/<préfixe>/`.

Le nom doit être écrit en entier dans le YAML : c'est ce qui permet au scan de l'embarquer au build ([ARCHITECTURE.md](ARCHITECTURE.md#icônes)).

## Fichiers du CDN

Les photos et la vidéo ne sont pas dans le dépôt. Le code construit leur adresse sur le CDN (`buildCdnUrl`) à partir de conventions de nommage :

| Fichier sur le CDN              | Utilisé pour                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `main-hero.mp4`                 | vidéo du hero d'accueil (affiche locale : `app/assets/images/main-hero.jpg`) |
| `page-hero.jpg`                 | fond flouté du hero des pages                                                |
| `<activité>.jpg`                | hero d'une activité, section de `/activites`                                 |
| `<activité>/<activité>-<n>.jpg` | carrousel, `n` de 1 à `imageCount`                                           |
| `<slug>.jpg`                    | cartes de `/rejoindre` (`devenir-membre`, `rejoindre-bureau`)                |
| valeur de `cta.image`           | photo de l'appel à l'action                                                  |
| `<type>/<date>.jpg`             | photo de repli d'un album de la galerie                                      |

Restent dans le dépôt : les images OpenGraph (`public/seo/<clé>.png`, référencées par `seo.yml`), les logos partenaires sans icône (`public/partners/`), le QR code et l'avion (`app/assets/images/`).

## Ajouter une collection

1. Créer le fichier dans `content/global/` (commun à plusieurs pages) ou `content/pages/`.
2. Ajouter sa source et son schéma Zod dans `content.schemas.ts`, puis `nom: defineCollection(collections.nom)` dans `content.config.ts`.
3. La lire avec `useAsyncData('<clé unique>', () => queryCollection('<nom>').first())`.
4. Ajouter l'entrée SEO si c'est une nouvelle page, et la mettre à jour ici.

## Ajouter une activité

Une activité n'est pas qu'un fichier de contenu : sa clé est écrite dans le code. Il faut toucher :

- `content/pages/activites/<clé>.yml`, une section dans `activites.yml`, une entrée dans `navigation.yml`, `seo.yml` (`activites-<clé>`) et `home.yml` ;
- `content.schemas.ts` : les enums `['oa', 'tandem', 'soufflerie', 'pac']` (`nextEvent`, `partners`, `navigation`) ;
- `app/composables/useActivities.ts` (`ActivityType`), `app/utils/activities.ts` (`ACTIVITY_ORDER`, `ACTIVITY_CSS_VAR`), `app/pages/activites/[activite].vue` (liste validée) ;
- `app/app.config.ts` (`efreipara.icons.activites`, `efreipara.colors`) ;
- `app/assets/css/main.css` (`--color-efreipara-<clé>` et `--color-on-efreipara-<clé>`) ;
- `typeLabel` de `galerie.vue` ;
- les photos sur le CDN et `public/seo/activites-<clé>.png`.

## Pour les éditeurs de contenu

- Modifier le fichier YAML ou Markdown, respecter l'indentation (deux espaces) et mettre entre guillemets un texte qui contient `:` suivi d'un espace ou commence par un caractère spécial.
- Les apostrophes typographiques (`’`) sont la norme dans les textes.
- Vérifier le rendu avec `bun dev`, puis lancer `bun run test` (voir ci-dessous).

## Vérifier le contenu

`bun run test` lance les tests de `tests/content/`, qui attrapent les erreurs d'édition que le build laisse passer :

- chaque fichier respecte le schéma de sa collection (champ manquant, mal typé, valeur hors liste), et chaque fichier de `content/` appartient à une collection ;
- chaque icône citée existe (une icône inconnue disparaît du site sans erreur) ;
- chaque lien interne (`to`, `url`, `link` commençant par `/`) mène à une page ou à un fichier de `public/` ;
- chaque page a son entrée dans `seo.yml`, et chaque image de partage existe ;
- les clés d'activité citées (galerie, événement, partenaires, accueil, menu) existent, et chaque option de « Nous rejoindre » a sa redirection prérendue.

Le message d’échec donne le fichier et le chemin du champ en cause.
