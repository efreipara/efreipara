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
├── content.config.ts    # Configuration de Nuxt Content
└── content.schemas.ts   # Schémas des collections de contenu
```

## 📚 Documentation

La documentation détaillée du projet est dans le dossier [`docs/`](docs/) :

| Document                                  | Contenu                                                       |
| ----------------------------------------- | ------------------------------------------------------------- |
| [PRD.md](docs/PRD.md)                     | Ce que fait le site : pages, sections, comportements          |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md)   | Stack, organisation du code, génération, Docker, nginx        |
| [CONTENT.md](docs/CONTENT.md)             | Collections de contenu, formats, fichiers attendus sur le CDN |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Thème, couleurs, polices, icônes, composants réutilisables    |
| [SECURITY.md](docs/SECURITY.md)           | Modèle de menace et règles à respecter                        |
| [CODE_STYLE.md](docs/CODE_STYLE.md)       | Conventions de code, formatage, commits                       |
| [TESTING.md](docs/TESTING.md)             | Vérifications avant de livrer                                 |

## 🚀 Pour les développeurs

### Technologies utilisées

Ce projet utilise les technologies et modules suivants :

- **[Bun](https://bun.sh)** - Gestion des paquets, scripts et génération du site
- **[Nuxt](https://nuxt.com)** - Framework Vue.js, utilisé en génération statique (`nuxt generate`)
- **[Nuxt UI](https://ui.nuxt.com)** - Bibliothèque de composants UI
- **[Nuxt Content](https://content.nuxt.com)** - Gestion de contenu basée sur les fichiers
- **[Plausible Analytics](https://plausible.io)** - Analytiques respectueuses de la vie privée
- **[TailwindCSS](https://tailwindcss.com)** - Framework CSS utility-first
- **[Nginx](https://www.nginx.com)** - Sert le site généré en production
- **[Docker](https://www.docker.com)** - Conteneurisation pour le déploiement

#### Librairies d'icônes

Le projet utilise [@nuxt/icon](https://github.com/nuxt/icon) avec les collections suivantes :

- **[Tabler Icons](https://icon-sets.iconify.design/tabler/)** (`@iconify-json/tabler`) - Collection d'icônes moderne et légère
- **[Simple Icons](https://icon-sets.iconify.design/simple-icons/)** (`@iconify-json/simple-icons`) - Icônes de marques et logos populaires

Mais aussi des icônes personnalisées ajoutées dans le dossier `app/assets/icons/` :

- Logos Efrei Para
- Logo Efrei
- Logo iFly
- Pictogrammes Creative Commons

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

# Vérifier les types (vue-tsc)
bun run typecheck

# Pour formatter le code avec Prettier
bun format

# Tests : logique et contenu (Vitest), puis site généré (Playwright, sur Brave ou Chromium)
bun run test
bun run generate && bun run test:e2e

# Pour construire l'image Docker (les variables d'environnement doivent être définies)
bun docker:build

# Préparer photos et vidéo pour le CDN : cdn/sources/ → cdn/dist/ (voir docs/CONTENT.md)
bun run cdn:build
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
```

#### Pour l'image Docker

Le fichier `.env.example` contient toutes les variables nécessaires. Copiez-le vers `.env` et modifiez les valeurs selon votre environnement :

```bash
cp .env.example .env
```

`bun run docker:build` lit le `.env` et passe les variables en `build args` : elles sont figées dans le site généré au moment du build, et `CDN_URL` et `PLAUSIBLE_URL` servent aussi à la CSP de nginx au démarrage du conteneur.

## ✏️ Pour les éditeurs de contenu

### Modifier le contenu du site

Certaines sections du site sont gérées via [Nuxt Content](https://content.nuxt.com). Les fichiers de contenu se trouvent dans le dossier `content/` et utilisent les formats Markdown (`.md`) ou YAML (`.yml`).

### Pages éditables

Tous les textes du site sont éditables. Les plus courants :

- **Prochain événement** : `content/global/next-event.yml` - Bannière en haut du site
- **Galerie** : `content/pages/galerie.yml` - Albums photos
- **FAQ** : `content/pages/faq.yml` - Questions fréquemment posées
- **Documents** : `content/pages/documents.yml` - Liens vers les documents utiles
- **Activités** : `content/pages/activites/*.yml` - Une page par activité, et tout ce qui la présente ailleurs (menu, accueil, galerie)
- **Coordonnées et réseaux** : `content/global/club.yml` - E-mail, adresse, Discord, Instagram…
- **Règlement** : `content/pages/legal/reglement.md` - Règlement intérieur du club
- **Mentions légales** : `content/pages/legal/mentions-legales.md`
- **RGPD** : `content/pages/legal/rgpd.md` - Politique de confidentialité

La liste complète des fichiers, leurs champs et les conventions sont décrits dans [docs/CONTENT.md](docs/CONTENT.md).

### Photos et vidéo

Elles ne sont pas dans le dépôt mais sur le CDN. Déposer les originaux dans `cdn/sources/` (dossier ignoré par git), lancer `bun run cdn:build`, puis téléverser le contenu de `cdn/dist/`. Les couvertures de la galerie sont téléchargées par le script d'après `galerie.yml` : noms et formats dans [docs/CONTENT.md](docs/CONTENT.md#fichiers-du-cdn).

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

## 🏷️ Versions

Le projet suit le [versionnage sémantique](https://semver.org/lang/fr/) : la version courante est dans `package.json`, l'historique dans [CHANGELOG.md](CHANGELOG.md), et chaque version a son tag git `vX.Y.Z`.

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
