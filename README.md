<div align="center">

[![Efrei Para banner](./assets/banner.png)](https://efreipara.fr)

# Efrei Para 🪂

**Le site du club de parachutisme de l'[Efrei](https://efrei.fr)**

[![Nuxt 4](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt&logoColor=white)](https://nuxt.com)
[![Nuxt UI 4](https://img.shields.io/badge/Nuxt_UI-4-00DC82?logo=nuxt&logoColor=white)](https://ui.nuxt.com)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Bun](https://img.shields.io/badge/Bun-1.4-fbf0df?logo=bun&logoColor=white)](https://bun.sh)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

[**efreipara.fr**](https://efreipara.fr) · [activités](https://efreipara.fr/activites) · [galerie](https://efreipara.fr/galerie) · [rejoindre](https://efreipara.fr/rejoindre) · [faq](https://efreipara.fr/faq)

</div>

## 🎯 À propos du site

Le site Efrei Para est la vitrine numérique du club de parachutisme de l'Efrei. Il permet aux étudiants et visiteurs de :

- Découvrir les activités proposées (Tandem, Soufflerie, PAC, OA)
- Consulter les informations pratiques et le règlement
- Voir les galeries photos des sauts
- Contacter le bureau et devenir membre

## 📁 Structure du projet

```
efreipara/
├── app/
│   ├── assets/          # Assets statiques (CSS, fonts, icons)
│   ├── components/      # Composants Vue réutilisables
│   ├── composables/     # Fonctions composables Vue
│   ├── pages/           # Pages du site (routing automatique)
│   ├── app.vue          # Composant racine de l'application
│   └── app.config.ts    # Configuration de l'application
├── content/             # Contenu en Markdown/YAML
├── public/              # Fichiers publics statiques
├── nuxt.config.ts       # Configuration principale de Nuxt
└── content.config.ts    # Configuration de Nuxt Content
```

## 🚀 Pour les développeurs

### Technologies utilisées

Ce projet utilise les technologies et modules suivants :

- **[Bun](https://bun.sh)** - Runtime JavaScript rapide pour le développement et la production
- **[Nuxt](https://nuxt.com)** - Framework Vue.js full-stack
- **[Nuxt UI](https://ui.nuxt.com)** - Bibliothèque de composants UI
- **[Nuxt Content](https://content.nuxt.com)** - Gestion de contenu basée sur les fichiers
- **[Plausible Analytics](https://plausible.io)** - Analytiques respectueuses de la vie privée
- **[TailwindCSS](https://tailwindcss.com)** - Framework CSS utility-first
- **[Nginx](https://www.nginx.com)** - Serveur web pour la production
- **[Docker](https://www.docker.com)** - Conteneurisation pour le déploiement

#### Librairies d'icônes

Le projet utilise [@nuxt/icon](https://github.com/nuxt/icon) avec les collections suivantes :

- **[Tabler Icons](https://icon-sets.iconify.design/tabler/)** (`@iconify-json/tabler`) - Collection d'icônes moderne et légère
- **[Simple Icons](https://icon-sets.iconify.design/simple-icons/)** (`@iconify-json/simple-icons`) - Icônes de marques et logos populaires

Mais aussi des icônes personnalisées ajoutées dans le dossier `assets/icons/`, comme :

- Logos Efrei Para
- Logo Efrei

### Installation et démarrage

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/efreipara/efreipara.git
   cd efreipara
   ```

2. **Installer les dépendances**

   ```bash
   bun install
   ```

3. **Lancer le serveur de développement**

   ```bash
   bun dev
   ```

4. **Accéder au site**

   Ouvrez votre navigateur à l'adresse `http://localhost:3000`

### Commandes disponibles

```bash
# Démarrer le serveur de développement
bun dev

# Linter le code
bun lint

# Pour formatter le code avec Prettier
bun format

# Pour construire l'image Docker (les variables d'environnement doivent être définies)
bun docker:build
```

### Variables d'environnement

#### Pour le développement local

Si nécessaire, créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# URL du CDN Cloudflare pour les images
CDN_URL=https://...

# Token local pour contourner la protection hotlink Cloudflare en dev
CDN_DEV_TOKEN=xxxxxxxx

# URL de l'instance Plausible Analytics
PLAUSIBLE_URL=https://...

# Domaine pour Plausible Analytics
PLAUSIBLE_DOMAIN=...

# URL du site (pour le SEO et autres métadonnées)
NUXT_PUBLIC_SITE_URL=https://...
```

#### Pour Docker Compose

Le fichier `.env.example` contient toutes les variables nécessaires. Copiez-le vers `.env` et modifiez les valeurs selon votre environnement :

```bash
cp .env.example .env
```

Les variables d'environnement sont injectées au moment du build Docker via `build args`, ce qui permet de générer une version statique optimisée avec les bons URLs

## ✏️ Pour les éditeurs de contenu

### Modifier le contenu du site

Certaines sections du site sont gérées via [Nuxt Content](https://content.nuxt.com). Les fichiers de contenu se trouvent dans le dossier `content/` et utilisent les formats Markdown (`.md`) ou YAML (`.yml`).

### Pages éditables

- **FAQ** : `content/faq.yml` - Questions fréquemment posées
- **Documents** : `content/documents.yml` - Liste des documents téléchargeables
- **Règlement** : `content/reglement.md` - Règlement intérieur du club
- **Mentions légales** : `content/mentions-legales.md`
- **RGPD** : `content/rgpd.md` - Politique de confidentialité

## 🔧 Maintenance

### Mettre à jour les dépendances

Pour vérifier les mises à jour disponibles :

```bash
bun outdated
```

Pour mettre à jour toutes les dépendances de façon interactive :

```bash
bun update -i
```

Pour mettre à jour une dépendance spécifique :

```bash
bun update <package-name> --latest
```

### Déploiement

Le site est déployé automatiquement via Docker. La configuration se trouve dans :

- `Dockerfile` - Configuration de l'image Docker
- `nginx/` - Configuration du serveur web

## 📝 Licence

### Code source

Le code source de ce projet est sous licence [MIT](https://opensource.org/license/MIT) - voir le fichier [LICENSE](LICENSE) pour plus de détails.

### Contenus

Les contenus textuels et documentaires sont sous licence [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/deed.fr), sauf mention contraire.

### Photos, vidéos & logos

Les photos, vidéos et logos sont **Tous droits réservés / All rights reserved** et ne peuvent être réutilisés sans autorisation explicite du club Efrei Para.

## 📧 Contact

Pour toute question concernant le site web, contactez le bureau d'Efrei Para via [efreipara.fr/contact](https://efreipara.fr/contact).

---

Développé avec ❤️ par les membres d'Efrei Para
