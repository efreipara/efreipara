# Efrei Para — Produit

> **Périmètre** : ce que le site montre et fait pour le visiteur — pages, comportements, règles visibles.
> **À mettre à jour** dès qu'un comportement visible change (page, section, filtre, bannière, redirection, option d'accessibilité).
> Le « comment » est dans [ARCHITECTURE.md](ARCHITECTURE.md), les textes et leur structure dans [CONTENT.md](CONTENT.md), l'apparence dans [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

## 1. Contexte

Site vitrine du club de parachutisme de l'Efrei (rattaché au BDS). Il présente le club et ses activités, et oriente vers les canaux où tout se passe réellement : le Discord, Instagram et des formulaires externes (Google Forms) pour l'inscription aux événements et l'adhésion.

- Public : étudiants de l'Efrei et curieux, souvent sur téléphone. Le ton tutoie le visiteur.
- Site **public et statique** : pas de compte, pas de saisie enregistrée par le site, pas de back-office. Le contenu est modifié dans le dépôt (voir [CONTENT.md](CONTENT.md)).
- Interface **100 % en français**.

### Activités

Le club propose quatre activités. Chacune a une couleur et une icône propres, reprises partout (menus, cartes, bannière, galerie) :

| Clé          | Libellé        | Description courte                 |
| ------------ | -------------- | ---------------------------------- |
| `tandem`     | Saut en Tandem | Découverte avec un moniteur        |
| `soufflerie` | Soufflerie     | Chute libre en tunnel de vent      |
| `pac`        | PAC            | Progression Accompagnée en Chute   |
| `oa`         | Saut en OA     | Saut solo en ouverture automatique |

Partout (menus, accueil, `/activites`, précédent / suivant des pages d'activité), les activités suivent le même ordre : tandem, soufflerie, PAC, OA.

## 2. Structure générale

### En-tête

- Logo Efrei Para (version claire ou sombre selon le thème), lien vers l'accueil annoncé « Efrei Para, accueil » par les lecteurs d'écran.
- **Grand écran (`lg` et plus)** : logo à gauche, menu centré, actions à droite. Le menu commence par « Nos activités », qui déroule les quatre activités en grille 2 × 2 (libellé, description, teinte de l'activité au survol), puis les liens Documents, Galerie, FAQ, Nous rejoindre (ordre donné par le champ `header` de `navigation.yml`). À droite : les réseaux choisis dans `navigation.yml` (Instagram et Discord), le menu d'accessibilité et le bouton clair / sombre.
- **Petit écran** : logo, puis accessibilité, clair / sombre et bouton burger (l'icône menu tourne et s'efface pendant que la croix apparaît, et l'inverse à la fermeture). Le menu ouvert liste « Nos activités » et ses quatre activités, les autres pages de l'en-tête, puis tous les réseaux sociaux. La page en cours y est mise en évidence (fond léger, teinte de l'activité pour une page d'activité).

### Événements

Les événements à venir viennent de `events.yml`. Chacun a un titre court, une activité, un lieu et un lien d'inscription facultatifs, et soit un **jour fixé**, soit des **mois possibles** quand la date n'est pas encore connue (« janvier ou février 2027 »). Un événement reste affiché jusqu'à son jour inclus, ou jusqu'à la fin de son dernier mois possible ; cette date est vérifiée dans le navigateur, si bien qu'un événement passé disparaît même sans nouvelle publication. Pas de page agenda ni d'historique : seuls les événements à venir sont montrés.

### Bannière d'événement

Au-dessus de l'en-tête, une bannière annonce l'événement le plus proche **dont le jour est fixé** ; sans un tel événement, pas de bannière.

- Phrase générée : « Prochain événement : baptême en soufflerie à iFly Paris le vendredi 4 décembre » (lieu omis s'il n'est pas connu). S'il y a d'autres événements à venir, un lien souligné « · +N » termine la phrase et mène à la section de l'accueil (nom pour les lecteurs d'écran : « Voir N autres événements »).
- Teintée par la couleur de l'activité, avec son icône, le titre (entier, sur plusieurs lignes si besoin), un bouton « Inscription » (formulaire externe, nouvel onglet ; absent sans lien), « En savoir plus » vers la page de l'activité (avec son icône) et une croix « Fermer la bannière ». Sous 768 px, l'icône de gauche est masquée et les boutons passent sous le titre.
- Fermée, elle ne revient pas pendant la session du navigateur pour cet événement ; un nouvel événement (autre date ou autre type) la fait réapparaître.
- Rendue côté navigateur uniquement, elle s'ouvre en douceur en poussant la page, et se referme de la même façon.

### Pied de page

- Quatre colonnes (deux par ligne sur téléphone, alignées à gauche) : **Activités** (page des activités + les quatre activités), **Club** (toutes les pages de `navigation.yml`, dont Nous contacter), **Réseaux** (Discord, Instagram, LinkedIn, Bento, GitHub), **Légal** (Mentions légales, Règlement, RGPD, Statut du site — ce dernier dans un nouvel onglet).
- À gauche : copyright de l'année en cours et licences (code source sous MIT, avec le numéro de version discret entre parenthèses après « Code source » — lien vers l'historique des versions, nouvel onglet —, contenus CC BY-NC 4.0, photos, vidéos et logos du club tous droits réservés, puis, sur une ligne à part, logos des partenaires propriété de leurs titulaires).
- À droite : logo Efrei (lien vers efrei.fr) et icônes des réseaux.

### Appel à l'action

En bas de l'accueil, de la page des activités, de chaque activité, de la galerie et du contact : bloc « Prêt à prendre de la hauteur ? » avec deux boutons (activités, nous rejoindre) et une photo, sur un fond de parachutes qui tombent.

### Accessibilité et thème

- **Menu d'accessibilité** (icône dans l'en-tête, pleine quand une option est active) : cases « Police dyslexique » (Open Dyslexic partout, titres compris) et « Contraste élevé » (contraste renforcé, photos et vidéos épargnées). Les choix sont gardés sur l'appareil.
- **Clair / sombre** : bouton dans l'en-tête, avec une transition en cercle depuis le bouton quand le navigateur le permet. Par défaut, le thème du système ; un choix manuel vaut pour la session du navigateur.
- Changement de page en fondu.
- **Comportement d'application** : le texte n'est pas sélectionnable, sauf ce qu'on recopie (e-mail et adresse de la page Contact, réponses de la FAQ, pages légales). Photos et vidéo ne se glissent pas et n'ouvrent pas de menu au clic droit ni à l'appui long ; sur une carte cliquable (album de la galerie, logo de partenaire, document…), ce menu est celui du lien, pour en copier l'adresse ; la vidéo d'accueil n'a ni image dans l'image ni diffusion. Pas de surbrillance à l'appui ni de zoom au double appui ; le zoom à deux doigts reste possible.

## 3. Pages

### Accueil — `/`

- **Hero** plein écran (hauteur de la fenêtre moins l'en-tête) : vidéo en boucle, muette, lancée une fois la page chargée (son affiche s'affiche d'abord), avec un bouton pause / lecture en bas à droite (elle ne se lance pas avec « réduire les animations »), logo Efrei Para, phrase d'accroche (description SEO de l'accueil), boutons « Nos activités » et « Nous rejoindre », flèche animée vers le bas.
  Chaque section a un surtitre et un titre alignés à gauche ; les sections alternent fond clair et bande légèrement teintée.

- **Qui sommes-nous ?** : paragraphes de présentation (mots clés en gras), puis trois chiffres (membres, activités, année de création) dont le nombre défile de 0 à sa valeur (2,5 s) quand il devient visible, le suffixe (« + ») conservé ; illustration d'avion à droite à partir de `lg`.
- **Nos activités** : quatre cartes à photo (étiquette de l'activité avec son icône, titre, description, « En savoir plus »), sur 1, 2 puis 4 colonnes ; bouton « Découvrir toutes nos activités en détail » à droite du titre sur grand écran.
- **Prochains événements** (ancre `#evenements`), seulement s'il y en a : une carte par événement, du plus proche au plus lointain, sur 1, 2 puis 3 colonnes, teintée par l'activité. Pavé de date (jour et mois, ou icône de calendrier sans jour fixé), activité, titre, date en toutes lettres, lieu, bouton « Inscription » (ou « Inscriptions bientôt » sans lien) et « En savoir plus » vers la page de l'activité.
- **Pourquoi Efrei Para ?** : photo de groupe du club et trois points forts teintés.
- **Derniers albums** : les trois albums les plus récents de la galerie (mêmes cartes que `/galerie`), et un lien vers la galerie.
- **Nos partenaires** : logos sur tuiles blanches, liens externes.

### Activités — `/activites`

Une section par activité, image et texte alternés gauche / droite sur grand écran, une section sur deux sur bande : photo, surtitre (icône et libellé de l'activité, teintés), titre, description, quatre points forts, bouton vers la page de l'activité (teinté au survol).

### Page d'une activité — `/activites/[activite]`

Seules les quatre clés existent (`oa`, `tandem`, `soufflerie`, `pac`) ; toute autre adresse donne une 404. Les sections suivantes s'affichent dans l'ordre, chacune seulement si son contenu existe ; elles alternent fond clair et bande sans trou quand une section manque, et celles qui ont un titre portent un surtitre teinté (« À venir », « Les points forts », « Le déroulé », « Avant de t’inscrire », « Ils nous accompagnent ») :

1. **Hero** : badge de l'activité, titre, description, photo, fond flouté de la même photo. Sur très grand écran (`2xl`), liens latéraux vers l'activité précédente et suivante.
2. **Chiffres** clés (altitude, durée, vitesse…).
3. **Prochains événements** de l'activité : mêmes cartes que l'accueil, sans l'activité ni « En savoir plus ».
4. **Introduction** : paragraphes, mots clés en gras.
5. **Carrousel** de photos : défilement automatique (3 s, en pause au survol, désactivé avec « réduire les animations »), en boucle, 1 / 2 / 3 photos visibles selon la largeur ; une photo introuvable est retirée.
6. **Pourquoi choisir {activité} ?** : points forts.
7. **Comment ça se passe ?** : frise des étapes, alternée gauche / droite à partir de `md`.
8. **Prérequis**.
9. **Nos partenaires** liés à l'activité.
10. Appel à l'action.

### Galerie — `/galerie`

Albums photo des événements, hébergés sur des sites externes (principalement Efrei Picture Studio).

- **Filtres** : « Tout voir » et une pastille par type d'activité présent ; la pastille active prend la couleur de l'activité, un second clic revient à « Tout voir ». Un compteur (« 7 albums », dans la teinte de l'activité filtrée, annoncé aux lecteurs d'écran) suit le filtre ; au changement, les albums glissent vers leur nouvelle place et la carte mise en avant se redimensionne (immédiat avec « réduire les animations »).
- Albums triés du plus récent au plus ancien. Sans filtre et à partir de trois albums, le premier est mis en avant (deux colonnes sur deux lignes en `lg`).
- **Carte** : photo de couverture, badge du type, titre, date (« 6 mars 2026 »), lieu, « Voir l'album sur {source} ». Un clic ouvre l'album dans un nouvel onglet.
- **Photo** : photo de l'album sur le CDN ; un squelette s'affiche jusqu'au chargement ou à l'échec définitif. La photo de la carte mise en avant est chargée en priorité, les autres au défilement.

### Documents — `/documents`

- Pastilles des catégories dans l'en-tête de la page, sous la description : un clic fait défiler en douceur jusqu'à la catégorie (sous l'en-tête) ; le visiteur peut interrompre le défilement, et il est immédiat avec « réduire les animations ».
- Une section par catégorie, une sur deux sur bande : nombre de documents (« 3 docs ») en surtitre dans la couleur de la catégorie, nom et description, collés à gauche pendant le défilement sur grand écran ; à droite (dessous sur téléphone), la liste des documents : icône, titre, description, site de destination (« Efrei Para » ou le domaine du lien, comme « ffp.asso.fr », masqué sur téléphone).
- Un document **interne** (page du site) s'ouvre dans l'onglet, un document **externe** dans un nouvel onglet, avec une icône de lien externe.
- En bas, encadré « Un document manquant ? » avec les boutons Discord, Instagram et « Signaler sur GitHub ».

### FAQ — `/faq`

- Mêmes pastilles de catégories que Documents.
- Par catégorie, une sur deux sur bande : nombre de questions en surtitre dans la couleur de la catégorie et nom, collés à gauche sur grand écran, puis un accordéon de questions numérotées (une seule ouverte à la fois, refermable ; la question ouverte est marquée d'un trait de la couleur de la catégorie). La réponse accepte la mise en forme Markdown (gras, liens, retours à la ligne) et peut avoir des boutons d'action.
- En bas, encadré « Une question sans réponse ? » (Discord, Instagram).

### Nous rejoindre — `/rejoindre`

- Bandeau « Prérequis important » : il faut être sur le Discord, avec un bouton pour le rejoindre.
- Deux cartes : **Devenir membre** et **Rejoindre le bureau** (photo, icône, titre et lien teintés), qui ouvrent chacune un formulaire externe dans un nouvel onglet.
- **Pourquoi nous rejoindre ?** : sur bande, photo de groupe du club et trois points teintés.

### Nous contacter — `/contact`

Quatre cartes de même structure (surtitre avec icône, contenu, boutons en bas), deux par ligne à partir de `md` :

- **E-mail** : adresse du club en grand, phrase d'invitation, bouton `mailto:`.
- **Réseaux sociaux** : un bouton par réseau (nouvel onglet).
- **Adresse** du campus en grand, avec liens Google Maps, Apple Plans et Waze.
- **Support technique** du site : signaler sur GitHub, ou écrire au mainteneur.

### Ancienne page À propos — `/about`

Retirée tant qu'aucun texte n'est prêt ; l'adresse mène à l'accueil.

### Raccourcis des activités — `/tandem`, `/soufflerie`, `/pac`, `/oa`

Adresses courtes à partager pour chaque activité : `/<activité>` mène directement à `/activites/<activité>`, sans écran de redirection. Une activité ajoutée a son raccourci.

### QR code — `/qr`

Page autonome, sans en-tête ni pied de page, pour projeter le QR code du club : fond bleu nuit, parachutes blancs qui tombent, QR code centré, bouton discret vers l'accueil en haut à gauche, bouton plein écran en haut à droite, tous deux nommés pour les lecteurs d'écran. Non indexée.

### Pages légales — `/mentions-legales`, `/reglement`, `/rgpd`

En-tête compact commun (surtitre « Informations légales », titre et description de la page), puis le texte mis en forme depuis le Markdown, avec un sommaire des sections : collant dans la colonne de droite sur grand écran (section en cours surlignée), menu repliable « Sur cette page » au-dessus du texte sur téléphone. Un clic dans le sommaire ou sur un titre fait descendre en douceur jusqu'à la section (immédiat avec « réduire les animations », arrêté par la molette ou le toucher), sans ajouter de `#` à l'adresse ; sur téléphone, le menu se referme d'abord. Titres dans la police de titre, « Dernière mise à jour : » suivi de la date en toutes lettres, en bas, quand elle est renseignée. Les liens externes s'ouvrent dans un nouvel onglet.

### Redirections — `/discord`, `/instagram`, `/devenir-membre`, `/rejoindre-bureau`

Adresses courtes à partager (QR code, affiches, réseaux). La page affiche l'icône, un titre, « Redirection vers… » et un bouton de secours, puis envoie aussitôt le navigateur vers la cible : le Discord, l'Instagram, ou le formulaire de l'option correspondante de « Nous rejoindre ». En développement, `?noRedirect` dans l'adresse garde la page affichée.

### Erreurs

Toute adresse inconnue donne une page d'erreur avec l'en-tête du site et un fond de parachutes : titre et explication en français selon le code (404 « Page introuvable », 500, autre), boutons « Retour à l'accueil » et « Signaler l'erreur » (nouvelle issue GitHub).

### Référencement

Seule l'accueil apparaît dans les moteurs de recherche : les autres pages sont exclues par la balise `noindex`, mais gardent titre, description et image de partage pour les réseaux. Les pages d'erreur ont un titre (« Page introuvable - Efrei Para ») et ne sont pas indexées.

### Version pour les agents d'IA — `/llms.txt`

Le contenu du site en un seul fichier Markdown, sans interface, au format [llms.txt](https://llmstxt.org) : présentation du club, points forts, chaque activité (description, chiffres, points forts, déroulé, prérequis), événements à venir au moment de la publication (jour fixé ou mois possibles, lieu, lien), adhésion, FAQ complète, documents, galerie, partenaires, contact et liens vers les pages légales (sans leur texte). Chaque section donne l'adresse de la page correspondante. Aucun lien du site n'y mène.

## 4. Mesure d'audience

Plausible compte les pages vues et les clics vers les liens externes, sans cookie ni bandeau de consentement.

Chaque clic sur un lien qui sort du site (autre site, adresse e-mail, page de redirection comme `/discord` ou `/rejoindre-bureau`) est aussi compté sous le nom « <page> › <lien> » (« Contact › Instagram », « FAQ › Devenir membre du bureau ») ; la navigation entre les pages du site n'est suivie que par les pages vues. Dans l'en-tête (menus compris), la bannière et le pied de page, la page est remplacée par la zone (« Header › Instagram Efrei Para », « Footer › GitHub », « Bannière › Inscription »), quelle que soit la page visitée. Le lien est nommé par son libellé (ou le titre de la carte) : renommer un libellé dans le contenu change le nom de l'événement.

Un événement n'apparaît dans Plausible que lorsqu'un objectif (Goal) de même nom, à la lettre et aux majuscules près, est créé dans les réglages du site ; les clics antérieurs ne sont pas repris. La liste de tous les noms et la façon de créer les Goals sont dans [plausible/README.md](plausible/README.md).

## 5. Hors périmètre

Pas prévu pour l'instant : comptes et espace membre, formulaires hébergés par le site (inscription, contact), paiement, page agenda et historique des événements (seuls les événements à venir sont montrés, voir [Événements](#événements)), galerie hébergée sur le site, traduction, recherche.
