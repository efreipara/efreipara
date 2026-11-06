export type AccessibilityFeatures = {
  dyslexic: boolean
  highContrast: boolean
}

export const defaultAccessibility: AccessibilityFeatures = {
  dyslexic: false,
  highContrast: false,
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
