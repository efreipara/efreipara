# Efrei Para — Contenu

> **Périmètre** : modèle de contenu — collections Nuxt Content, fichiers sources, champs, formats acceptés, fichiers attendus sur le CDN.
> **À mettre à jour** dès qu'une collection, un schéma de `content.schemas.ts`, une convention de nommage d'image ou la règle « texte dans `content/` » change.
> L'usage de chaque page est dans [PRD.md](PRD.md), le chargement des données dans [ARCHITECTURE.md](ARCHITECTURE.md#chargement-du-contenu).

## Principe

Le texte visible du site vit dans `content/` (YAML et Markdown), pas dans les composants : un membre du bureau doit pouvoir changer une phrase, une FAQ ou un album sans toucher au code. Chaque fichier correspond à une **collection** déclarée dans [`content.config.ts`](../content.config.ts), avec sa source et son schéma Zod dans [`content.schemas.ts`](../content.schemas.ts). Nuxt Content ne vérifie pas le schéma au build : c'est `bun run test` qui le fait, avec d'autres contrôles (voir [Vérifier le contenu](#vérifier-le-contenu)).

Ce qui n'est pas dans `content/` :

- **`app/app.config.ts`** : le thème Nuxt UI seulement (couleurs, réglages globaux des composants). Coordonnées, réseaux, icônes et options d'une page sont dans `content/`.
- les noms des marques et logos (Efrei Para, Efrei, iFly), qui sont des icônes.

**Une option écrite dans le contenu est lue par sa page.** Un champ qu'aucune page n'affiche est un oubli de la page, qu'on corrige en le branchant, pas en le supprimant. Une même valeur ne s'écrit qu'à un endroit : au plus près de la page qui l'affiche.

Un nouveau texte va dans `content/` : dans le fichier de la page qui l'affiche, ou dans `labels.yml` pour un composant commun à plusieurs pages. Un libellé qui contient `{nom}` est complété par le code (`fillLabel`), un compteur a ses deux formes (`one`, `other`, lues par `countLabel`).

## Collections

| Collection       | Type | Source                                | Utilisée par                                                                                                 |
| ---------------- | ---- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `navigation`     | data | `global/navigation.yml`               | en-tête, pied de page, menu d'accessibilité                                                                  |
| `seo`            | data | `global/seo.yml`                      | toutes les pages (`useSeo`), phrase du hero d'accueil                                                        |
| `cta`            | data | `global/cta.yml`                      | appel à l'action en bas de page                                                                              |
| `partners`       | data | `global/partners.yml`                 | accueil, pages d'activité                                                                                    |
| `club`           | data | `global/club.yml`                     | e-mail, adresse, réseaux et dépôt GitHub : en-tête, pied de page, contact, rejoindre, redirections, erreurs  |
| `labels`         | data | `global/labels.yml`                   | libellés des composants communs : bannière, sections d'activité, encadré d'aide, pages légales, erreurs      |
| `nextEvent`      | data | `global/next-event.yml`               | bannière d'événement                                                                                         |
| `home`           | data | `pages/home.yml`                      | `/`                                                                                                          |
| `activitesIndex` | data | `pages/activites.yml`                 | hero de `/activites`                                                                                         |
| `activites`      | data | `pages/activites/<activité>.yml`      | `/activites/<activité>`, et partout où l'activité apparaît (menus, accueil, `/activites`, galerie, bannière) |
| `galerie`        | data | `pages/galerie.yml`                   | `/galerie`                                                                                                   |
| `documents`      | data | `pages/documents.yml`                 | `/documents`                                                                                                 |
| `faq`            | data | `pages/faq.yml`                       | `/faq`                                                                                                       |
| `rejoindre`      | data | `pages/rejoindre.yml`                 | `/rejoindre`, `/devenir-membre`, `/rejoindre-bureau`                                                         |
| `contact`        | data | `pages/contact.yml`                   | `/contact`                                                                                                   |
| `redirects`      | data | `pages/redirects.yml`                 | pages de redirection                                                                                         |
| `qr`             | data | `pages/qr.yml`                        | `/qr`                                                                                                        |
| `legal`          | page | `pages/legal/<slug>.md` (préfixe `/`) | `/mentions-legales`, `/reglement`, `/rgpd`                                                                   |

### Points notables par collection

- **`navigation`** : `logo.label` nomme le lien du logo pour les lecteurs d'écran ; `headerSocials` liste les clés de `club.yml` affichées dans l'en-tête sur grand écran ; `pages[]` alimente la colonne Club du pied de page ; une page avec un champ `header` (nombre) apparaît aussi dans l'en-tête, triée par ce nombre. Les activités du menu viennent de leurs fichiers (`menu`). `footer` donne les titres des colonnes, puis le copyright, les licences (`code`, `content`, avec `{version}` dans `code.changelog`), `media` et le lien `school` ; `menuButton` et `colorModeButton` sont les libellés des boutons de l'en-tête. `accessibilityMenu` règle le bouton du menu d'accessibilité (`label`, `icon`, `activeIcon` quand une option est active) ; `accessibility[].key` doit correspondre à une option de `useAccessibility` (`dyslexic`, `highContrast`). `legal[]` peut contenir un lien externe (`target: _blank`).
- **`seo`** : `pages` est indexé par la clé de route (voir [ARCHITECTURE.md](ARCHITECTURE.md#seo)) : une nouvelle page ajoute son entrée, sauf si son propre fichier porte ses options SEO (pages légales, options de `rejoindre.yml`) : jamais aux deux endroits (`title`, `description`, `ogImage` et `robots` facultatifs) ; sans `robots`, elle reprend `defaults.robots` (`noindex, follow` : seule l'accueil est indexée). `pages.index.description` est aussi la phrase du hero d'accueil.
- **`nextEvent`** : un seul événement (`title`, `date` `AAAA-MM-JJ`, `type` = clé d'activité, `url` du formulaire). La bannière disparaît d'elle-même après la date.
- **`partners`** : `icon` (icône d'une collection, ex. `ifly:logo-color`) ou `logo` (fichier de `public/`, ex. `/partners/skydive-event.webp`) ; `activites` liste les pages d'activité où le partenaire apparaît (l'accueil les montre tous).
- **`home`** : chaque section (`about`, `activites`, `why`, `albums`, `partners`) a son `headline` (surtitre) et son `title` ; `activites.cardLink` (« En savoir plus » des cartes d'activité) et `activites.link` ; `why.image` (chemin sur le CDN) et `why.alt` pour la photo, `why.items[]` les points forts ; `albums.link` vers la galerie ; `hero.links` (boutons sous la phrase d'accroche ; `variant` : `primary` par défaut ou `secondary`, voir [rôles des boutons](DESIGN_SYSTEM.md#boutons)), `hero.scrollIcon` (flèche vers le bas) et `hero.video` (`pause`, `play` : `label` et `icon` du bouton de la vidéo) ; `stats[].title` commence par le nombre à animer, le reste est un suffixe (`100+`). `why.items[].type` donne la teinte ; les cartes d'activité viennent des fichiers d'activité (`card`, photo `<clé>.jpg`), les albums de `galerie.yml`.
- **`activites`** : un fichier par activité, nommé par sa clé (`tandem.yml`…), retrouvé par son `stem` (`pages/activites/tandem`). C'est la seule source de l'activité ; l'ordre d'affichage est celui de `ACTIVITY_KEYS`.
  - Obligatoires : `title`, `description`, `label` (nom court : badge, précédent / suivant), `alt` (photo du hero), `icon`, `menu` (`label`, `description` : en-tête et pied de page), `card` (`title`, `description` : carte de l'accueil), `section` (`title`, `description`, `features[]`, `linkLabel` : section de `/activites`, qui reprend `alt` pour la photo).
  - Facultatifs : `galleryLabel` (filtres et étiquettes de la galerie, sinon `label`) ; `intro`, `stats`, `features`, `steps`, `requirements`, dont la section disparaît s'ils sont absents ; `imageCount` = nombre de photos du carrousel sur le CDN (0 ou absent : pas de carrousel).
- **En-tête des pages** : `headline` (surtitre court au-dessus du titre) dans `activites.yml`, `galerie.yml`, `contact.yml`, `rejoindre.yml` (sous `hero`) et `documents.yml`, `faq.yml` (à la racine).
- **`galerie`** : `hero.allLabel` (filtre « Tout voir »), `hero.linkLabel` et `hero.linkSourceLabel` (avec `{source}`) ; `albumIcons` (`date`, `location` : icônes des cartes) ; `items[]` avec `title`, `type` (clé d'activité), `date` (`AAAA-MM-JJ`, sert au tri et à la photo de repli), `location`, `url` de l'album, `photo` (URL de la couverture, facultative) et `source` (nom du site, affiché dans « Voir l'album sur … »). L'ordre du fichier est indifférent.
- **`documents`** : `count` (`one`, `other` : « 3 docs ») ; catégories (`name`, `description`, `icon`, `color`) et documents (`title`, `description`, `url`, `icon`, `type` : `internal` pour une page du site, `external` sinon).
- **`faq`** : `count` (`one`, `other`) ; catégories (`name`, `color`, `questions[]`) ; une question a `question`, `answer`, `icon` (obligatoire ; l'icône de la première question sert aussi d'icône à la catégorie) et des `buttons` facultatifs (`label`, `to`, `icon`, `target`), tous secondaires.
- **`documents`, `faq`** : `color` vaut `blue`, `green`, `purple`, `red`, `orange` ou `gray` (`useCategoryColor`) ; autre valeur ou absence → couleur primaire. `helpcta` : `title`, `description`, `icon`, `buttons` ⊂ `discord`, `instagram`, `github` (libellés et liens tirés de `club`).
- **`rejoindre`** : `why.headline`, `why.image` (chemin sur le CDN) et `why.alt` pour la photo de « Pourquoi nous rejoindre ? » ; `options[].slug` (`devenir-membre`, `rejoindre-bureau`) est à la fois le nom de la route de redirection et celui de la photo sur le CDN ; `link` est le formulaire externe ; `options[].type` et `why.features[].type` sont des clés d'activité qui donnent la teinte. `title`, `description` et `ogImage` d'une option sont le SEO de sa page de redirection.
- **`club`** : `socials[]` (`key`, `name`, `icon`, `url`) dans l'ordre d'affichage, la `key` sert à retrouver un réseau (`discord`, `instagram`, `github`…) ; `address` est écrite une fois, les liens Google Maps, Apple Plans et Waze en sont calculés (`mapUrls`) ; `github.repo` (historique des versions) et `github.issues` (signalement).
- **`cta`** : `title`, `description`, `image`, `alt` et `links[]` (`label`, `to`, `icon`, `variant` : `primary` par défaut ou `secondary`).
- **`contact`** : chaque bloc a son `icon` ; `address.buttons.<carte>` a `label` et `icon`. Les adresses viennent de `club`.
- **`labels`** : `banner` (`register`, `registerIcon`, `info`, `close`) ; `socialLink` (`{name}`) ; `activity` (`goTo` et `features` avec `{label}`, `steps`, `requirements`, `partners`, `photo` avec `{label}` et `{n}` : texte alternatif des photos du carrousel, `headlines` : surtitres des sections points forts, déroulé, prérequis et partenaires) ; `helpCta.github` ; `legal.headline` (surtitre des pages légales), `legal.toc` (titre du sommaire), `legal.updatedAt` ; `error` (`home`, `report`, `messages` par code HTTP, dont `default` obligatoire).
- **`qr`** : `alt` du QR code, `home` (`label`, `icon` du bouton vers l'accueil), `fullscreen` (`enterLabel`, `exitLabel`, `enterIcon`, `exitIcon`) ; les libellés sont lus par les lecteurs d'écran.
- **`redirects`** : `form` (textes communs aux redirections vers un formulaire de `rejoindre.yml`) et `socials.<clé>` (`title`, `redirectText`, `buttonLabel`) : la page `/<clé>` mène au réseau de même clé dans `club.yml`. Ajouter une entrée crée la redirection et son prérendu ; elle a aussi besoin de son entrée dans `seo.yml`.
- **`legal`** : un fichier `<slug>.md` répond à l'adresse `/<slug>` ; front-matter `title` et `description` (titre et description de l'en-tête de la page et de son SEO, absente de `seo.yml`), `updatedAt` (`AAAA-MM-JJ`, facultatif, affiché en bas de page), puis le texte en Markdown, sans titre `#` (le titre de la page vient du front-matter).

## Formats acceptés

| Champ                                              | Format                                                                                             |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `home.about.paragraphs[]`, `activites.<…>.intro[]` | Markdown en ligne (`**gras**`, mis en valeur dans la couleur des titres), un paragraphe par entrée |
| `faq.categories[].questions[].answer`              | Markdown ; une ligne vide sépare deux paragraphes (un simple retour à la ligne est ignoré)         |
| `pages/legal/*.md`                                 | Markdown Nuxt Content ; liens externes ouverts dans un nouvel onglet                               |
| tous les autres champs texte                       | texte brut (échappé par Vue)                                                                       |

Règle de sécurité associée : [SECURITY.md](SECURITY.md#2-html-issu-du-contenu).

## Icônes

Toute valeur `icon` est un nom `prefixe:nom` d'une collection embarquée :

- `tabler:*` — icônes générales ([liste](https://icon-sets.iconify.design/tabler/)) ;
- `simple-icons:*` — logos de marques ;
- `efreipara:*` (`logo`, `logo-color`, `efreipara`, `parachute`), `efrei:*`, `ifly:*`, `creativecommons:*` — SVG de `app/assets/icons/<préfixe>/` ;
- `activite:<clé>` — l'icône de chaque activité (`activite:tandem`…), dessinée au gabarit Tabler ([DESIGN_SYSTEM.md](DESIGN_SYSTEM.md#icônes)).

Le nom doit être écrit en entier dans le YAML : c'est ce qui permet au scan de l'embarquer au build ([ARCHITECTURE.md](ARCHITECTURE.md#icônes)).

## Fichiers du CDN

Les photos et la vidéo ne sont pas dans le dépôt. Le code construit leur adresse sur le CDN (`buildCdnUrl`) à partir de conventions de nommage :

| Fichier sur le CDN              | Utilisé pour                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `main-hero.mp4`                 | vidéo du hero d'accueil (affiche locale : `app/assets/images/main-hero.jpg`) |
| `<activité>.jpg`                | hero d'une activité, section de `/activites`                                 |
| `<activité>/<activité>-<n>.jpg` | carrousel, `n` de 1 à `imageCount`                                           |
| `<slug>.jpg`                    | cartes de `/rejoindre` (`devenir-membre`, `rejoindre-bureau`)                |
| valeur de `cta.image`           | photo de l'appel à l'action                                                  |
| valeur de `home.why.image`      | photo à côté de « Pourquoi Efrei Para ? » sur l'accueil                      |
| valeur de `rejoindre.why.image` | photo à côté de « Pourquoi nous rejoindre ? »                                |
| `<type>/<date>.jpg`             | photo de repli d'un album de la galerie                                      |

Restent dans le dépôt : les images OpenGraph (`public/seo/<clé>.png`, référencées par `seo.yml`), les logos partenaires sans icône (`public/partners/`), le QR code et l'avion (`app/assets/images/`).

## Ajouter une collection

1. Créer le fichier dans `content/global/` (commun à plusieurs pages) ou `content/pages/`.
2. Ajouter sa source et son schéma Zod dans `content.schemas.ts`, puis `nom: defineCollection(collections.nom)` dans `content.config.ts`.
3. La lire avec `useAsyncData('<clé unique>', () => queryCollection('<nom>').first())`.
4. Ajouter l'entrée SEO si c'est une nouvelle page, et la mettre à jour ici.

## Ajouter une activité

Une activité n'est pas qu'un fichier de contenu : sa clé est écrite dans le code. Il faut toucher :

- `content/pages/activites/<clé>.yml` (tous les champs obligatoires ci-dessus) et l'entrée `activites-<clé>` de `seo.yml` ;
- `ACTIVITY_KEYS` dans `app/utils/activities.ts` (la place de la clé donne l'ordre d'affichage) ;
- `app/assets/css/main.css` (`--color-efreipara-<clé>`, `--color-on-efreipara-<clé>` et la liste `@source inline('activity-{…}')`) ;
- l'icône `app/assets/icons/activite/<clé>.svg`, au gabarit Tabler ([DESIGN_SYSTEM.md](DESIGN_SYSTEM.md#icônes)), citée par le champ `icon` ;
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
- chaque page a son SEO, dans `seo.yml` ou dans son propre fichier mais pas aux deux endroits, et chaque image de partage existe ;
- chaque clé d'activité a son fichier et inversement ; une clé citée ailleurs (galerie, événement, partenaires, accueil) est vérifiée par le schéma.

Le message d’échec donne le fichier et le chemin du champ en cause.
