// Violations graves (serious, critical) déjà présentes, relevées par axe le 23 octobre 2026.
// À corriger dans la phase de correctifs : chaque correction retire sa ligne d'ici.
// Une nouvelle violation, absente de cette liste, fait échouer le test.
export const knownViolations: Record<string, string[]> = {
  // Boutons d'icône de la page QR sans nom accessible
  'link-name': ['/qr'],
  'button-name': ['/qr'],
  // <dl> des chiffres d'activité : dd avant dt, regroupés dans des <div>
  'definition-list': [
    '/activites/oa',
    '/activites/pac',
    '/activites/soufflerie',
    '/activites/tandem',
  ],
  // Teintes d'activité (tandem en clair), pastilles de catégorie, titres de /rejoindre
  // (axe ne mesure plus ces derniers, sous le lien de UPageCard, mais le contraste est inchangé)
  'color-contrast': [
    '/activites/soufflerie',
    '/activites/tandem',
    '/documents',
    '/faq',
    '/rejoindre',
  ],
}
