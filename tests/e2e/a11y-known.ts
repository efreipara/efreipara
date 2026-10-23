// Violations graves (serious, critical) déjà présentes, relevées par axe le 23 octobre 2026.
// À corriger dans la phase de correctifs : chaque correction retire sa ligne d'ici.
// Une nouvelle violation, absente de cette liste, fait échouer le test.
export const knownViolations: Record<string, string[]> = {
  // Logos partenaires (icône Efrei, iFly) et boutons d'icône de la page QR sans nom accessible
  'link-name': ['/', '/activites/soufflerie', '/qr'],
  'button-name': ['/qr'],
  // <dl> des chiffres d'activité : dd avant dt, regroupés dans des <div>
  'definition-list': [
    '/activites/oa',
    '/activites/pac',
    '/activites/soufflerie',
    '/activites/tandem',
  ],
  // Teintes d'activité (tandem en clair), pastilles de catégorie, filtre actif de la galerie,
  // titres de /rejoindre, date de mise à jour des pages légales
  'color-contrast': [
    '/activites/soufflerie',
    '/activites/tandem',
    '/documents',
    '/faq',
    '/galerie',
    '/mentions-legales',
    '/reglement',
    '/rejoindre',
    '/rgpd',
  ],
}
