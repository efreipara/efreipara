export type AccessibilityFeatures = {
  dyslexic: boolean
  highContrast: boolean
  // Décorations de saison (utils/season.ts), affichées par défaut
  seasonal: boolean
}

export const defaultAccessibility: AccessibilityFeatures = {
  dyslexic: false,
  highContrast: false,
  seasonal: true,
}

// Valeur du localStorage illisible ou modifiée à la main : seules les clés connues à valeur booléenne comptent
export const parseAccessibility = (saved: string | null): AccessibilityFeatures => {
  const features = { ...defaultAccessibility }
  if (!saved) return features
  let parsed: unknown
  try {
    parsed = JSON.parse(saved)
  } catch {
    return features
  }
  if (!parsed || typeof parsed !== 'object') return features
  for (const key of Object.keys(features) as (keyof AccessibilityFeatures)[]) {
    const value = (parsed as Record<string, unknown>)[key]
    if (typeof value === 'boolean') features[key] = value
  }
  return features
}

// Option qui s'écarte de sa valeur par défaut : le bouton du menu passe en plein
export const isAdjusted = (features: AccessibilityFeatures, key: keyof AccessibilityFeatures) =>
  features[key] !== defaultAccessibility[key]
