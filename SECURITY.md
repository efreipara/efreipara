# Politique de sécurité

## Signaler une faille

Merci de **ne pas ouvrir d'issue publique** pour une faille de sécurité.

- **De préférence** : signalement privé sur GitHub, onglet [Security → Report a vulnerability](https://github.com/efreipara/efreipara/security/advisories/new).
- **À défaut** : par e-mail au mainteneur du site, à l'adresse indiquée sur [efreipara.fr/contact](https://efreipara.fr/contact).

Indiquer si possible l'adresse concernée, les étapes pour reproduire et l'impact constaté.

Le site est maintenu bénévolement par des membres du club : une première réponse est visée sous une semaine, sans garantie de délai. Il n'y a pas de programme de récompense.

## Périmètre

- **Couvert** : le site [efreipara.fr](https://efreipara.fr) et le code de ce dépôt (pages générées, configuration nginx, image Docker).
- **Hors périmètre** : les services tiers vers lesquels le site renvoie ou qu'il utilise (formulaires d'inscription, HelloAsso, Discord, Instagram, CDN, mesure d'audience), les sites des partenaires, et les tests de déni de service.

## Version prise en charge

Seule la version en ligne sur [efreipara.fr](https://efreipara.fr) (branche `main`) reçoit des correctifs.

Modèle de menace et règles suivies par le projet : [docs/SECURITY.md](docs/SECURITY.md).
