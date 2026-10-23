# Changelog

Historique des versions du site Efrei Para. Le projet suit le [versionnage sémantique](https://semver.org/lang/fr/).

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
