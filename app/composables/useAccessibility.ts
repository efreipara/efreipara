import type { AccessibilityFeatures } from '~/utils/accessibility'

export const useAccessibility = () => {
  const features = useState<AccessibilityFeatures>('accessibility', () => ({
    ...defaultAccessibility,
  }))

  const init = () => {
    features.value = parseAccessibility(localStorage.getItem('accessibility'))
  }

  const toggle = (feature: keyof AccessibilityFeatures) => {
    features.value[feature] = !features.value[feature]
    localStorage.setItem('accessibility', JSON.stringify(features.value))
  }

  return { features, init, toggle }
}
