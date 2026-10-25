# Changelog

Historique des versions du site Efrei Para. Le projet suit le [versionnage sémantique](https://semver.org/lang/fr/).

## 1.12.0 — 25 octobre 2026

### Modifications

- Nouveaux boutons, accordés aux titres du site : l'action principale de chaque bloc est une plaque inclinée en lettres de course (« Nous rejoindre », « Inscription », « Envoyer un e-mail »…), les actions secondaires sont soulignées du trait des surtitres, qui s'étire au survol.
- Chaque bouton a retrouvé son rôle : « Nous rejoindre » ressort sur la vidéo de l'accueil, « Inscription » dans la bannière d'événement ; les itinéraires et le support de la page Contact, les boutons de la FAQ et ceux de l'encadré d'aide passent au second plan.
- Filtres de la galerie et pastilles de catégories de Documents et de la FAQ : même forme inclinée.

### Corrections

- Galerie : le filtre Tandem sélectionné reste lisible (texte sombre sur l'or au lieu du blanc).

## 1.11.0 — 25 octobre 2026

### Ajouts

- Pages légales : un sommaire des sections suit la lecture dans la colonne de droite (menu « Sur cette page » sur téléphone). Un clic descend en douceur jusqu'à la section, sans modifier l'adresse de la page.

## 1.10.2 — 25 octobre 2026

### Corrections

- Accueil et Nous rejoindre : nouvelles photos du club à côté de « Pourquoi Efrei Para ? » et de « Pourquoi nous rejoindre ? », avec des textes alternatifs qui les décrivent.

## 1.10.1 — 25 octobre 2026

### Corrections

- Nouvelle icône pour le saut en OA : deux voiles l'une derrière l'autre, sans la traînée au-dessus de la voile.

## 1.10.0 — 25 octobre 2026

### Modifications

- Tout le site suit la présentation de l'accueil : chaque section a un surtitre et un titre alignés à gauche, et les sections alternent fond clair et bande légère.
- Pages intérieures (activités, galerie, documents, FAQ, nous rejoindre, contact, pages légales) : un en-tête compact remplace le grand bandeau centré presque vide.
- Pages d'activité : points forts, déroulé, prérequis et partenaires avec un surtitre aux couleurs de l'activité ; points forts sans encadrés.
- Documents et FAQ : le nombre de documents ou de questions s'affiche au-dessus du nom de chaque catégorie, dans sa couleur ; l'encadré d'aide en bas de page est plus sobre.
- Nous rejoindre : « Pourquoi nous rejoindre ? » s'accompagne d'une photo du club.
- Contact : quatre blocs de même présentation, l'adresse e-mail et l'adresse postale en grand.

## 1.9.0 — 25 octobre 2026

### Ajouts

- Accueil : les trois derniers albums de la galerie, avec un lien vers toute la galerie.

### Modifications

- Accueil repensé : chaque section a un surtitre et un titre alignés à gauche ; les activités sont présentées en cartes à photo ; « Pourquoi Efrei Para ? » s'accompagne d'une photo du club ; la présentation et les chiffres sont réunis.
- Les textes colorés aux teintes des activités sont plus lisibles en mode sombre (rouge de la PAC surtout).

## 1.8.0 — 25 octobre 2026

### Ajouts

- Chaque activité a sa propre icône, dessinée pour le club : le tandem (une voile, deux personnes), l'OA (la voile reliée à l'avion par la sangle), la soufflerie (le volant au-dessus de l'air du tunnel) et la PAC (seul sous sa voile). Elles remplacent des pictogrammes génériques dans les menus, les cartes, la galerie et les pages d'activité.

## 1.7.1 — 25 octobre 2026

### Corrections

- Accueil : sur les petits téléphones, le logo du hero n'est plus rogné.
- Accueil : le bouton pause / lecture de la vidéo est entouré d'un contour visible quand on l'atteint au clavier.

## 1.7.0 — 25 octobre 2026

### Ajouts

- Accueil : un bouton en bas à droite met la vidéo en pause ou la relance ; avec le réglage « réduire les animations », elle ne se lance plus d'elle-même.
- Icône Efrei Para quand on ajoute le site à l'écran d'accueil d'un téléphone.

### Modifications

- Pages plus légères : les logos sont optimisés, l'accueil pèse deux fois moins une fois compressé ; la page QR code aussi.
- Le texte en gras utilise le vrai gras de la police Outfit, plus net, au lieu d'un gras simulé.
- Textes : le site tutoie partout ; ponctuation, espaces et unités à la française (« 4 000 m », « 200 km/h ») ; plus de tirets longs à la chaîne.
- Contact : les pastilles « Adresse » et « Support technique » sont aux couleurs du club, et non plus à celles de l'OA et de la PAC.
- La barre du navigateur sur téléphone prend le bleu du club.
- Pour le bureau : `bun run typecheck` vérifie les types, et `bun run docker:build` accepte un `.env` commenté.

### Corrections

- Partage sur LinkedIn, X ou Facebook : l'image d'aperçu s'affiche, et « Nous rejoindre » a enfin la sienne.
- Moteurs de recherche : le fichier robots.txt ne bloque plus les pages, ce qui permet de lire leur consigne « ne pas indexer » (seule l'accueil reste indexée).
- Page d'erreur : titre d'onglet « Page introuvable - Efrei Para », langue déclarée, messages adaptés à un site sans compte.
- Accessibilité : les chiffres et badges des activités (or du tandem surtout) et les pastilles de Documents et de la FAQ sont assez contrastés ; l'accueil a un titre principal ; chiffres clés correctement structurés ; textes alternatifs des photos revus.
- FAQ : la PAC est la « Progression Accompagnée en Chute » ; lieux des sauts corrigés ; coquilles.
- Documents : le lien vers iFly Paris fonctionne de nouveau.

## 1.6.1 — 24 octobre 2026

### Corrections

- En-tête : le logo, les liens du menu, les activités du sous-menu et les lignes du menu mobile s'enfoncent légèrement à l'appui, comme les boutons.

## 1.6.0 — 24 octobre 2026

### Modifications

- En-tête : le menu est centré, entre le logo à gauche et les boutons à droite (Instagram, Discord, accessibilité, clair / sombre).
- Pied de page : sur téléphone, les liens s'affichent sur deux colonnes alignées à gauche, au lieu d'une seule colonne centrée.

### Corrections

- En-tête : le lien du logo est annoncé « Efrei Para, accueil » par les lecteurs d'écran (il était annoncé « Nuxt UI »).

## 1.5.0 — 24 octobre 2026

### Ajouts

- Contact : « Nos réseaux sociaux » a son icône, comme les autres blocs de la page.

### Modifications

- Pour le bureau : tout ce qui décrit une activité (menu, carte de l'accueil, section de la page des activités, libellé de la galerie, icône) est dans son seul fichier `content/pages/activites/<activité>.yml`.
- Pour le bureau : l'adresse, l'e-mail et les réseaux du club sont dans `content/global/club.yml`, et les textes encore écrits dans le code (boutons, titres de section, pied de page, messages d'erreur) sont passés dans le contenu.
- La page « À propos », vide, est retirée du site et du pied de page ; son adresse mène à l'accueil.
- Pages légales et redirections « Devenir membre » / « Rejoindre le bureau » : le titre et la description affichés lors d'un partage sont ceux de la page elle-même.

### Corrections

- Page QR code : les boutons « Retour à l'accueil » et « Plein écran » sont annoncés par les lecteurs d'écran.
- Page des activités : la photo du tandem a le même texte alternatif que sur sa page.

## 1.4.0 — 24 octobre 2026

### Ajouts

- Pied de page : le numéro de version du site s'affiche discrètement à côté de la licence du code source, avec un lien vers l'historique des versions.

## 1.3.0 — 24 octobre 2026

### Ajouts

- Les boutons et les cartes s'enfoncent légèrement quand on appuie dessus.
- Galerie : les albums apparaissent en fondu quand on change de filtre.
- La bannière d'événement s'ouvre et se referme en douceur, sans faire sauter la page.

### Modifications

- Navigation plus vive : le contenu d'une nouvelle page apparaît en moins de 300 ms au lieu d'environ une seconde.
- Carrousel des activités : il se met en pause au survol.

### Corrections

- Documents et FAQ : le défilement lancé par une pastille de catégorie s'arrête dès qu'on fait défiler soi-même, et il est immédiat avec le réglage « réduire les animations ».
- Carrousel des activités : il ne défile plus tout seul avec le réglage « réduire les animations ».

## 1.2.0 — 24 octobre 2026

### Ajouts

- Menu mobile : la page en cours est mise en évidence.

### Modifications

- Filtres de la galerie, pastilles de catégories (Documents, FAQ) et réseaux de la page Contact : on voit où l'on se trouve en naviguant au clavier, et le filtre actif est annoncé aux lecteurs d'écran.
- Cartes des activités, des documents et de « Nous rejoindre » : toute la carte est cliquable, avec un contour visible au clavier.
- Couleurs harmonisées avec le thème du site (filtres de la galerie, séparateurs de la FAQ en sombre, liens « Signaler l'erreur »).

### Corrections

- Pages légales : le trait au-dessus de la date de mise à jour n'est plus noir en thème clair, et la date est plus lisible.
- Logos des partenaires : chaque lien porte le nom du partenaire pour les lecteurs d'écran.
- Bannière d'événement : la croix de fermeture est annoncée « Fermer la bannière ».

## 1.1.2 — 24 octobre 2026

### Modifications

- Seule la page d'accueil est proposée aux moteurs de recherche : les autres pages le signalent désormais aussi dans leurs métadonnées.
- Site un peu plus léger : retrait d'un module d'images inutilisé.

### Corrections

- Contraste élevé : le voile de la vidéo d'accueil et les logos des partenaires ne sont plus sur-contrastés.
- Le réglage système « réduire les animations » est respecté partout : apparitions, transitions, compteurs de l'accueil et bascule clair / sombre.
- Prochain événement : le saut en tandem est bien classé comme tandem (couleur et lien vers la bonne activité).

## 1.1.1 — 23 octobre 2026

### Modifications

- Bibliothèques du site mises à jour (Nuxt, Nuxt UI, gestion des polices).
- Polices de repli plus fidèles en mode « Police dyslexique », le temps que la police se charge.

### Corrections

- Faille de sécurité corrigée dans le nettoyage du texte mis en forme de l'accueil, des activités et de la FAQ (DOMPurify).

## 1.1.0 — 3 octobre 2026

### Modifications

- Galerie : les albums pointent vers les nouvelles adresses d'Efrei Picture Studio.
- Dépendances mises à jour.

### Corrections

- Galerie : quand la miniature d'un album ne se charge pas, la photo de repli du CDN s'affiche à la place.

## 1.0.1 — 31 août 2026

### Corrections

- Les adresses de redirection (`/discord`, `/instagram`, `/devenir-membre`, `/rejoindre-bureau`) ne renvoient plus d'erreur 500 : elles sont maintenant générées avec le reste du site.

## 1.0.0 — 31 août 2026

Première version publique du site.

### Ajouts

- Accueil : vidéo plein écran, présentation du club, chiffres animés, activités, « Pourquoi Efrei Para ? » et partenaires.
- Activités : page d'ensemble et une page par activité (tandem, soufflerie, PAC, OA) avec chiffres clés, introduction, carrousel de photos, points forts, déroulé, prérequis et partenaires.
- Galerie des albums photo, filtrable par activité.
- Pages Documents et FAQ, classées par catégories.
- Pages Nous rejoindre et Nous contacter.
- Pages légales (mentions légales, règlement intérieur, RGPD).
- Adresses courtes de redirection vers le Discord, Instagram et les formulaires d'adhésion.
- Page QR code à projeter, en plein écran.
- Bannière du prochain événement, avec lien d'inscription.
- Thème clair et sombre, options d'accessibilité (police dyslexique, contraste élevé).
- Référencement : titre, description et image de partage pour chaque page.
- Mesure d'audience sans cookie (Plausible).
- Contenu entièrement modifiable dans `content/` (Nuxt Content).
- Site statique servi par nginx dans Docker, avec en-têtes de sécurité.
