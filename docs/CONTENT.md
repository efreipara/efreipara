# Efrei Para — Contenu

> **Périmètre** : modèle de contenu — collections Nuxt Content, fichiers sources, champs, formats acceptés, fichiers attendus sur le CDN.
> **À mettre à jour** dès qu'une collection, un schéma de `content.schemas.ts`, une convention de nommage d'image ou la règle « texte dans `content/` » change.
> L'usage de chaque page est dans [PRD.md](PRD.md), le chargement des données dans [ARCHITECTURE.md](ARCHITECTURE.md#chargement-du-contenu).

## Principe

Le texte visible du site vit dans `content/` (YAML et Markdown), pas dans les composants : un membre du bureau doit pouvoir changer une phrase, une FAQ ou un album sans toucher au code. Il est rangé **par langue** : `content/fr/` et `content/en/` ([Langues](#langues)). Chaque fichier correspond à une **collection** déclarée dans [`content.config.ts`](../content.config.ts) une fois par langue (`home_fr`, `home_en`), avec sa source et son schéma Zod dans [`content.schemas.ts`](../content.schemas.ts). Le code lit le texte en `t.cle.sous.cle` ([ARCHITECTURE.md](ARCHITECTURE.md#chargement-du-contenu)). Nuxt Content ne vérifie pas le schéma au build : c'est `bun run test` qui le fait, avec d'autres contrôles (voir [Vérifier le contenu](#vérifier-le-contenu)).

Ce qui n'est pas dans `content/` :

- **`app/app.config.ts`** : le thème Nuxt UI seulement (couleurs, réglages globaux des composants). Coordonnées, réseaux, icônes et options d'une page sont dans `content/`.
- les noms des marques et logos (Efrei Para, Efrei, iFly), qui sont des icônes.

**Une option écrite dans le contenu est lue par sa page.** Un champ qu'aucune page n'affiche est un oubli de la page, qu'on corrige en le branchant, pas en le supprimant. Une même valeur ne s'écrit qu'à un endroit : au plus près de la page qui l'affiche.

Un nouveau texte va dans `content/` : dans le fichier de la page qui l'affiche, ou dans `labels.yml` pour un composant commun à plusieurs pages. Un libellé qui contient `{nom}` est complété par le code (`fillLabel`), un compteur a ses deux formes (`one`, `other`, lues par `countLabel`).

## Collections

Les sources sont relatives au dossier de la langue (`global/seo.yml` = `content/fr/global/seo.yml`).

| Collection       | Type | Source                                | Utilisée par                                                                                                        |
| ---------------- | ---- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `navigation`     | data | `global/navigation.yml`               | en-tête, pied de page, menu d'accessibilité                                                                         |
| `seo`            | data | `global/seo.yml`                      | toutes les pages (`useSeo`), phrase du hero d'accueil                                                               |
| `cta`            | data | `global/cta.yml`                      | appel à l'action en bas de page                                                                                     |
| `partners`       | data | `global/partners.yml`                 | accueil, pages d'activité                                                                                           |
| `club`           | data | `global/club.yml`                     | e-mail, adresse, réseaux et dépôt GitHub : en-tête, pied de page, contact, rejoindre, redirections, erreurs         |
| `labels`         | data | `global/labels.yml`                   | libellés des composants communs : bannière, événements, sections d'activité, encadré d'aide, pages légales, erreurs |
| `events`         | data | `global/events.yml`                   | bannière, sections d'événements (accueil, pages d'activité)                                                         |
| `seasons`        | data | `global/seasons.yml`                  | décorations de saison (tout le site), case du menu d'accessibilité                                                  |
| `home`           | data | `pages/home.yml`                      | `/`                                                                                                                 |
| `activitesIndex` | data | `pages/activites.yml`                 | hero de `/activites`                                                                                                |
| `activites`      | data | `pages/activites/<activité>.yml`      | `/activites/<activité>`, et partout où l'activité apparaît (menus, accueil, `/activites`, galerie, bannière)        |
| `galerie`        | data | `pages/galerie.yml`                   | `/galerie`                                                                                                          |
| `documents`      | data | `pages/documents.yml`                 | `/documents`                                                                                                        |
| `faq`            | data | `pages/faq.yml`                       | `/faq`                                                                                                              |
| `rejoindre`      | data | `pages/rejoindre.yml`                 | `/rejoindre`, `/devenir-membre`, `/rejoindre-bureau`                                                                |
| `contact`        | data | `pages/contact.yml`                   | `/contact`                                                                                                          |
| `redirects`      | data | `pages/redirects.yml`                 | pages de redirection                                                                                                |
| `qr`             | data | `pages/qr.yml`                        | `/qr`                                                                                                               |
| `legal`          | page | `pages/legal/<slug>.md` (préfixe `/`) | `/mentions-legales`, `/reglement`, `/rgpd`                                                                          |

### Points notables par collection

- **`navigation`** : `logo.label` nomme le lien du logo pour les lecteurs d'écran ; `headerSocials` liste les clés de `club.yml` affichées dans l'en-tête sur grand écran ; `pages[]` alimente la colonne Club du pied de page ; une page avec un champ `header` (nombre) apparaît aussi dans l'en-tête, triée par ce nombre. Les activités du menu viennent de leurs fichiers (`menu`). `footer` donne les titres des colonnes, puis le copyright, les licences (`code`, `content`, avec `{version}` dans `code.changelog` ; `code.changelogGoal` nomme ce lien dans Plausible, sans numéro de version), `media`, `partnerLogos` (sur sa propre ligne) et le lien `school` ; `menuButton` et `colorModeButton` sont les libellés des boutons de l'en-tête. `accessibilityMenu` règle le bouton du menu d'accessibilité (`label`, `icon`, `activeIcon` quand une case affichée n'est pas dans son état par défaut) ; `accessibility[].key` doit correspondre à une option de `useAccessibility` (`dyslexic`, `highContrast`, `seasonal`) ; l'item `seasonal` n'est affiché que pendant une saison, avec l'icône de la saison (son `icon` ne sert que de repli). `legal[]` peut contenir un lien externe (`target: _blank`).
- **`seo`** : `pages` est indexé par la clé de route (voir [ARCHITECTURE.md](ARCHITECTURE.md#seo)) : une nouvelle page ajoute son entrée, sauf si son propre fichier porte ses options SEO (pages légales, options de `rejoindre.yml`) : jamais aux deux endroits (`title`, `description`, `ogImage`, `robots` et `goal` facultatifs) ; sans `robots`, elle reprend `defaults.robots` (`noindex, follow` : seule l'accueil est indexée). `pages.index.description` est aussi la phrase du hero d'accueil. `goal` nomme la page dans les événements Plausible quand le titre est trop long ([ARCHITECTURE.md](ARCHITECTURE.md#mesure-daudience)).
- **`events`** : `items[]`, liste éventuellement vide, dans n'importe quel ordre (le site trie). Chaque événement : `title` court, écrit comme un titre (« Baptême en soufflerie » ; la bannière met la première lettre en minuscule, sauf sigle), `type` = clé d'activité, `location` et `url` (formulaire d'inscription) facultatifs, et **soit** `date` (`AAAA-MM-JJ`, jour fixé), **soit** `months` (`['2027-01', '2027-02']`, mois possibles en ordre croissant) ; le schéma refuse les deux à la fois ou aucun. Les dates s'écrivent en toutes lettres d'elles-mêmes (« vendredi 4 décembre », « janvier ou février 2027 ») : ne pas les mettre dans le titre. Un événement disparaît après son jour, ou après la fin de son dernier mois ; seuls ceux qui ont une `date` peuvent être dans la bannière ([PRD.md](PRD.md#événements)).
- **`seasons`** : `items[]`, une saison par décoration, chacune faite d'icônes qui tombent sur tout le site. `key` unique, `start` et `end` au format `MM-JJ` (bornes incluses, répétées chaque année ; `start` après `end` fait passer le 31 décembre : `'12-20'` → `'01-05'`), `icon` (icône qui tombe, aussi celle de la case du menu d'accessibilité), `count` (nombre d'icônes, une quarantaine au plus pour rester léger), `color` et `colorDark` facultatif (couleur CSS en clair et en sombre, ex. `var(--color-navy-300)`, `white`). Si deux périodes se chevauchent, la première de la liste gagne. Ajouter un thème (Halloween, Octobre rose…) = ajouter une entrée ([PRD.md](PRD.md#accessibilité-et-thème)).
- **`partners`** : `icon` (icône d'une collection, ex. `ifly:logo-color`) ou `logo` (fichier de `public/`, ex. `/partners/skydive-event.webp`) ; `activites` liste les pages d'activité où le partenaire apparaît (l'accueil les montre tous).
- **`home`** : chaque section (`about`, `activites`, `events`, `why`, `albums`, `partners`) a son `headline` (surtitre) et son `title` ; `activites.cardLink` (« En savoir plus » des cartes d'activité) et `activites.link` ; `why.image` (chemin sur le CDN) et `why.alt` pour la photo, `why.items[]` les points forts ; `albums.link` vers la galerie ; `hero.links` (boutons sous la phrase d'accroche ; `variant` : `primary` par défaut ou `secondary`, voir [rôles des boutons](DESIGN_SYSTEM.md#boutons)), `hero.scrollIcon` (flèche vers le bas) et `hero.video` (`pause`, `play` : `label` et `icon` du bouton de la vidéo) ; `stats[].title` commence par le nombre à animer, le reste est un suffixe (`100+`). `why.items[].type` donne la teinte ; les cartes d'activité viennent des fichiers d'activité (`card`, photo `activites/<clé>`), les albums de `galerie.yml`.
- **`activites`** : un fichier par activité, nommé par sa clé (`tandem.yml`…), retrouvé par son `stem` (`fr/pages/activites/tandem`, `activityStem`). C'est la seule source de l'activité ; l'ordre d'affichage est celui de `ACTIVITY_KEYS`. La clé donne aussi le raccourci `/<clé>` vers `/activites/<clé>` ([PRD.md](PRD.md#raccourcis-des-activités--tandem-soufflerie-pac-oa)) : elle ne doit reprendre aucune autre route (`/discord`, `/rgpd`…).
  - Obligatoires : `title`, `description`, `label` (nom court : badge, précédent / suivant), `alt` (photo du hero), `icon`, `menu` (`label`, `description` : en-tête et pied de page), `card` (`title`, `description` : carte de l'accueil), `section` (`title`, `description`, `features[]`, `linkLabel` : section de `/activites`, qui reprend `alt` pour la photo).
  - Facultatifs : `galleryLabel` (filtres et étiquettes de la galerie, sinon `label`) ; `intro`, `stats`, `features`, `steps`, `requirements`, dont la section disparaît s'ils sont absents ; `imageCount` = nombre de photos du carrousel sur le CDN (0 ou absent : pas de carrousel).
- **En-tête des pages** : `headline` (surtitre court au-dessus du titre) dans `activites.yml`, `galerie.yml`, `contact.yml`, `rejoindre.yml` (sous `hero`) et `documents.yml`, `faq.yml` (à la racine).
- **`galerie`** : `hero.allLabel` (filtre « Tout voir »), `count` (`one`, `other` : « 7 albums » au-dessus de la grille), `hero.linkLabel` et `hero.linkSourceLabel` (avec `{source}`) ; `albumIcons` (`date`, `location` : icônes des cartes) ; `items[]` avec `title`, `type` (clé d'activité), `date` (`AAAA-MM-JJ`, sert au tri et à la photo de la carte), `location`, `url` de l'album, `photo` (URL `…/thumbnail` de la couverture sur Efrei Picture Studio, facultative, non affichée : leur API la réserve à leur propre site ; `bun run cdn:build` en tire la photo du CDN de la carte, voir [Préparer les médias](#préparer-les-médias)) et `source` (nom du site, affiché dans « Voir l'album sur … »). L'ordre du fichier est indifférent.
- **`documents`** : `count` (`one`, `other` : « 3 docs ») ; catégories (`name`, `description`, `icon`, `color`) et documents (`title`, `description`, `url`, `icon`, `type` : `internal` pour une page du site, `external` sinon). Le site affiché à droite d'un document vient de son `url` (domaine) ou, pour une page du site, de `seo.defaults.siteName`.
- **`faq`** : `count` (`one`, `other`) ; catégories (`name`, `color`, `icon` de la pastille, `questions[]`) ; une question a `question`, `answer` (numérotée à l'affichage) et des `buttons` facultatifs (`label`, `to`, `icon`, `target`), tous secondaires.
- **`documents`, `faq`** : `color` vaut `blue`, `green`, `purple`, `red`, `orange` ou `gray` (`useCategoryColor`) ; autre valeur ou absence → couleur primaire. `helpcta` : `title`, `description`, `buttons` ⊂ `discord`, `instagram`, `github` (libellés et liens tirés de `club`).
- **`rejoindre`** : `why.headline`, `why.image` (chemin sur le CDN) et `why.alt` pour la photo de « Pourquoi nous rejoindre ? » ; `options[].slug` (`devenir-membre`, `rejoindre-bureau`) est à la fois le nom de la route de redirection et celui de la photo sur le CDN ; `link` est le formulaire externe ; `options[].type` et `why.features[].type` sont des clés d'activité qui donnent la teinte. `title`, `description` et `ogImage` d'une option sont le SEO de sa page de redirection.
- **`club`** : `socials[]` (`key`, `name`, `icon`, `url`) dans l'ordre d'affichage, la `key` sert à retrouver un réseau (`discord`, `instagram`, `github`…) ; `address` est écrite une fois, les liens Google Maps, Apple Plans et Waze en sont calculés (`mapUrls`) ; `github.repo` (historique des versions) et `github.issues` (signalement).
- **`cta`** : `title`, `description`, `image`, `alt` et `links[]` (`label`, `to`, `icon`, `variant` : `primary` par défaut ou `secondary`).
- **`contact`** : chaque bloc a son `icon` ; `address.buttons.<carte>` a `label` et `icon`. Les adresses viennent de `club`.
- **`labels`** : `banner` (`title` et `titleAt` : phrase de la bannière avec `{title}`, `{date}` et, pour `titleAt`, `{location}` ; `more` : lien « +N » avec `{count}` ; `moreLabel` : son nom pour les lecteurs d'écran, `one` / `other` avec `{count}` ; `close`) ; `events` (`register`, `registerIcon`, `info`, `soon` à la place d'« Inscription » sans `url`, `or` entre les deux derniers mois possibles, `dateIcon`, `locationIcon`) ; `socialLink` (`{name}`) ; `goalZones` (`header`, `footer`, `banner` : portée des événements Plausible des clics dans ces zones) ; `activity` (`goTo` et `features` avec `{label}`, `steps`, `requirements`, `partners`, `photo` avec `{label}` et `{n}` : texte alternatif des photos du carrousel, `events` : titre de la section des événements, `headlines` : surtitres des sections points forts, déroulé, prérequis, partenaires et événements) ; `helpCta.github` ; `legal.headline` (surtitre des pages légales), `legal.toc` (titre du sommaire), `legal.updatedAt`, `legal.untranslated` (note au-dessus d’une page légale non traduite, facultative) ; `error` (`home`, `report`, `messages` par code HTTP, dont `default` obligatoire).
- **`qr`** : `alt` du QR code, `home` (`label`, `icon` du bouton vers l'accueil), `fullscreen` (`enterLabel`, `exitLabel`, `enterIcon`, `exitIcon`) ; les libellés sont lus par les lecteurs d'écran.
- **`redirects`** : `form` (textes communs aux redirections vers un formulaire de `rejoindre.yml`) et `socials.<clé>` (`title`, `redirectText`, `buttonLabel`) : la page `/<clé>` mène au réseau de même clé dans `club.yml`. Ajouter une entrée crée la redirection et son prérendu ; elle a aussi besoin de son entrée dans `seo.yml`.
- **`legal`** : un fichier `<slug>.md` répond à l'adresse `/<slug>` ; front-matter `title` et `description` (titre et description de l'en-tête de la page et de son SEO, absente de `seo.yml`), `updatedAt` (`AAAA-MM-JJ`, facultatif, affiché en bas de page), puis le texte en Markdown, sans titre `#` (le titre de la page vient du front-matter).

## Formats acceptés

| Champ                                              | Format                                                                                                                                                   |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home.about.paragraphs[]`, `activites.<…>.intro[]` | Markdown en ligne (`**gras**`, mis en valeur dans la couleur des titres), un paragraphe par entrée                                                       |
| `faq.categories[].questions[].answer`              | Markdown ; une ligne vide sépare deux paragraphes (un simple retour à la ligne est ignoré)                                                               |
| `pages/legal/*.md`                                 | Markdown Nuxt Content ; liens externes ouverts dans un nouvel onglet                                                                                     |
| liens `to`, `url`, `link` des boutons et cartes    | `https://…`, `mailto:…`, chemin du site (`/…`, pas `//…`) ou ancre (`#…`) ; tout autre schéma (`javascript:`, `data:`, `http:`) est refusé par le schéma |
| tous les autres champs texte                       | texte brut (échappé par Vue)                                                                                                                             |

Règle de sécurité associée : [SECURITY.md](SECURITY.md#2-html-issu-du-contenu).

## Icônes

Toute valeur `icon` est un nom `prefixe:nom` d'une collection embarquée :

- `tabler:*` — icônes générales ([liste](https://icon-sets.iconify.design/tabler/)) ;
- `simple-icons:*` — logos de marques ;
- `efreipara:*` (`logo`, `logo-color`, `efreipara`, `parachute`), `efrei:*`, `ifly:*`, `creativecommons:*` — SVG de `app/assets/icons/<préfixe>/` ;
- `activite:<clé>` — l'icône de chaque activité (`activite:tandem`…), dessinée au gabarit Tabler ([DESIGN_SYSTEM.md](DESIGN_SYSTEM.md#icônes)).

Le nom doit être écrit en entier dans le YAML : c'est ce qui permet au scan de l'embarquer au build ([ARCHITECTURE.md](ARCHITECTURE.md#icônes)).

## Fichiers du CDN

Les photos et la vidéo ne sont pas dans le dépôt. Le code construit leur adresse sur le CDN (`buildCdnUrl`, `cdnImage`) à partir de conventions de nommage.

Chaque photo existe en 3 largeurs, `<base>-480.webp`, `<base>-960.webp` et `<base>-1600.webp` ([Préparer les médias](#préparer-les-médias)) ; le code et le contenu ne citent que la **base**, sans largeur ni extension (`activites/carrousel/tandem-4`), et le navigateur choisit la largeur ([règle d'affichage](DESIGN_SYSTEM.md#formes)). Une photo citée doit exister dans les 3 largeurs.

| Base sur le CDN                      | Utilisée pour                                                    |
| ------------------------------------ | ---------------------------------------------------------------- |
| `activites/<activité>`               | hero d'une activité, section de `/activites`, carte de l'accueil |
| `activites/carrousel/<activité>-<n>` | carrousel, `n` de 1 à `imageCount`                               |
| `rejoindre/<slug>`                   | cartes de `/rejoindre` (`devenir-membre`, `rejoindre-bureau`)    |
| `galerie/<type>-<date>`              | photo d'un album de la galerie                                   |
| valeur de `cta.image`                | photo de l'appel à l'action (`rejoindre/rejoindre-bureau`)       |
| valeur de `home.why.image`           | photo à côté de « Pourquoi Efrei Para ? » sur l'accueil          |
| valeur de `rejoindre.why.image`      | photo à côté de « Pourquoi nous rejoindre ? »                    |

Vidéo du hero d'accueil : `accueil/video-av1.mp4`, puis `accueil/video-h264.mp4` pour les navigateurs qui ne lisent pas l'AV1 ; affiche locale `app/assets/images/main-hero.webp` (première image de la vidéo).

Les champs `image` du contenu sont vérifiés par le schéma : une base sans extension (`.jpg` refusé).

Restent dans le dépôt : les images OpenGraph (`public/seo/<clé>.png`, référencées par `seo.yml`), les logos partenaires sans icône (`public/partners/`), le QR code et l'avion (`app/assets/images/`).

### Préparer les médias

`bun run cdn:build` (`scripts/cdn-build.ts`) transforme les originaux en fichiers à téléverser sur le CDN. Il faut `cwebp`, `ffmpeg` et `ffprobe` (Homebrew : `brew install webp ffmpeg`).

- Originaux dans `cdn/sources/`, rangés comme sur le CDN, sans suffixe de taille (`activites/tandem.jpg`, `activites/carrousel/tandem-1.jpg`, `accueil/video.mov`). Résultat dans `cdn/dist/`, à téléverser à la main. Le dossier `cdn/` est ignoré par git : les originaux ne vont jamais dans le dépôt public.
- Photo (`.jpg`, `.png`, `.webp`, `.tif`) : WebP en 3 largeurs, `<chemin>-480.webp`, `-960`, `-1600` (`CDN_IMAGE_WIDTHS`, `app/utils/cdn.ts`), qualité 80, jamais agrandie : un original plus petit que la largeur est gardé à sa taille, et le script le signale. Métadonnées EXIF et XMP retirées (appareil, date, position GPS), profil couleur gardé (Display P3 des iPhone et Mac, sinon couleurs ternes). Exporter les photos droites : l'orientation EXIF n'est pas appliquée.
- Vidéo (`.mov`, `.mp4`) : `<chemin>-av1.mp4` (AV1, CRF 33) et `<chemin>-h264.mp4` (H.264, CRF 23, lu par tous les navigateurs), 1 080 px au plus, sans son ni métadonnées (date, titre, piste de timecode), lecture possible avant la fin du téléchargement (`faststart`). Réglages choisis par mesure VMAF sur la vidéo d'accueil : même fidélité à l'original que l'ancien fichier, 29 % plus léger en AV1.
- Couverture d'album : pour chaque album de `galerie.yml` dont `photo` finit par `/thumbnail`, le script télécharge l'original en pleine taille (`/full`) dans `cdn/sources/galerie/<type>-<date>.jpg` s'il n'y est pas déjà. Ajouter un album = renseigner `url` et `photo`, puis lancer le script ; pour reprendre une couverture changée, supprimer son fichier de `cdn/sources/`.
- Un fichier déjà produit et plus récent que son original n'est pas refait.

## Langues

- La version anglaise n'est **pas publiée** pour l'instant ([ARCHITECTURE.md](ARCHITECTURE.md#langues)) : `content/en/` reste à tenir à jour, les tests le vérifient comme le français.
- `content/fr/` est la référence ; `content/en/` en est la traduction, fichier pour fichier, avec la même structure (mêmes champs, mêmes listes dans le même ordre).
- **Ne se traduisent pas**, et restent identiques dans les deux langues : dates, types d'activité, icônes, images, couleurs, slugs, liens externes, et les noms Plausible (`goalZones`, `changelogGoal`, `goal` de `seo.yml`, en français partout).
- **Liens internes** : chaque langue écrit l'adresse de sa propre page, `/rejoindre` en français, `/en/join` en anglais (adresses traduites : [ARCHITECTURE.md](ARCHITECTURE.md#langues)). Les clés et slugs ne changent pas : `/en/activities/tandem`, `/en/rgpd`, `/en/discord`.
- **Écrits une seule fois**, en français : `club.yml`, `partners.yml`, `seasons.yml` (aucun texte à traduire) et les pages légales (pas encore traduites : la version anglaise du site affiche le texte français, avec une note). Ajouter un de ces fichiers dans `content/en/` le traduit.
- Un événement, un album ou une question ajouté en français s'ajoute aussi en anglais, à la même place : les tests le signalent sinon.
- Bouton de langue de l'en-tête : `navigation.yml › languageSwitch` (`label` visible : la langue en cours, « FR » ; `ariaLabel` dans la langue de la page, qui commence par ce texte visible et dit où mène le bouton).

## Ajouter une collection

1. Créer le fichier dans `content/<langue>/global/` (commun à plusieurs pages) ou `content/<langue>/pages/`, pour chaque langue (ou l'ajouter à `OPTIONAL_TRANSLATIONS` s'il n'a rien à traduire).
2. Ajouter sa source (relative au dossier de la langue) et son schéma Zod dans `content.schemas.ts` : `content.config.ts` en déclare une collection par langue. Un nombre entier au premier niveau du fichier s'écrit `z.number().multipleOf(1)`, jamais `.int()` : Nuxt Content en ferait une colonne texte, et la valeur reviendrait en chaîne (« 9 ») après une navigation interne (test de `schemas`).
3. La lire avec `const { t } = await useT('<nom>')`.
4. Ajouter l'entrée SEO si c'est une nouvelle page, et la mettre à jour ici.

## Ajouter une activité

Une activité n'est pas qu'un fichier de contenu : sa clé est écrite dans le code. Il faut toucher :

- `content/<langue>/pages/activites/<clé>.yml` (tous les champs obligatoires ci-dessus) et l'entrée `activites-<clé>` de `seo.yml`, dans chaque langue ;
- `ACTIVITY_KEYS` dans `app/utils/activities.ts` (la place de la clé donne l'ordre d'affichage) ;
- `app/assets/css/main.css` (`--color-efreipara-<clé>`, `--color-on-efreipara-<clé>` et la liste `@source inline('activity-{…}')`) ;
- l'icône `app/assets/icons/activite/<clé>.svg`, au gabarit Tabler ([DESIGN_SYSTEM.md](DESIGN_SYSTEM.md#icônes)), citée par le champ `icon` ;
- les photos sur le CDN et `public/seo/activites-<clé>.png`.

## Pour les éditeurs de contenu

- Modifier le fichier YAML ou Markdown, respecter l'indentation (deux espaces) et mettre entre guillemets un texte qui contient `:` suivi d'un espace ou commence par un caractère spécial.
- Les apostrophes typographiques (`’`) sont la norme dans les textes.
- Modifier aussi le fichier de même nom dans l'autre langue ([Langues](#langues)).
- Vérifier le rendu avec `bun dev`, puis lancer `bun run test` (voir ci-dessous).
- `/llms.txt` (version texte pour les agents d'IA) se refait à chaque publication à partir des mêmes fichiers : rien à modifier à part. Il reprend les titres et textes des pages, pas les libellés d'interface (boutons, icônes, textes pour lecteurs d'écran).

## Vérifier le contenu

`bun run test` lance les tests de `tests/content/`, qui attrapent les erreurs d'édition que le build laisse passer :

- chaque fichier respecte le schéma de sa collection (champ manquant, mal typé, valeur hors liste), dans chaque langue ; chaque fichier appartient à une collection, chaque langue a les mêmes fichiers que le français (sauf ceux écrits une seule fois), et `content/` ne contient qu'un dossier par langue déclarée ;
- chaque fichier traduit suit la structure du français : aucun champ ni élément de liste manquant, données identiques (dates, types, icônes, liens externes, noms Plausible), liens internes à l'adresse traduite de l'original ;
- chaque icône citée existe (une icône inconnue disparaît du site sans erreur) ;
- chaque lien interne (`to`, `url`, `link` commençant par `/`) mène à une page de sa langue ou à un fichier de `public/` ;
- dans chaque langue, chaque page a son SEO, dans `seo.yml` ou dans son propre fichier mais pas aux deux endroits, et chaque image de partage existe ;
- chaque clé d'activité a son fichier et inversement ; une clé citée ailleurs (galerie, événement, partenaires, accueil) est vérifiée par le schéma ;
- `/llms.txt`, construit à partir du contenu, n'a pas de valeur manquante et ses liens internes mènent à des pages.

Le message d’échec donne le fichier et le chemin du champ en cause.
