export type AccessibilityFeatures = {
  dyslexic: boolean
  highContrast: boolean
}

const defaultFeatures: AccessibilityFeatures = {
  dyslexic: false,
  highContrast: false,
}

export const useAccessibility = () => {
  const features = useState<AccessibilityFeatures>('accessibility', () => ({ ...defaultFeatures }))

  const init = () => {
    const saved = localStorage.getItem('accessibility')
    if (saved) features.value = { ...defaultFeatures, ...JSON.parse(saved) }
  }

  const toggle = (feature: keyof AccessibilityFeatures) => {
    features.value[feature] = !features.value[feature]
    localStorage.setItem('accessibility', JSON.stringify(features.value))
  }

  const hasActiveFeature = computed(() => Object.values(features.value).some(Boolean))

  return { features, init, toggle, hasActiveFeature }
}
