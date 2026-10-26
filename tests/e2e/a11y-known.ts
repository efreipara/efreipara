// Violations graves (serious, critical) déjà présentes, par règle et par page.
// Une nouvelle violation, absente de cette liste, fait échouer le test ; corriger une violation
// connue retire sa ligne d'ici. Liste vide depuis le 25 octobre 2026.
export const knownViolations: Record<string, string[]> = {}
