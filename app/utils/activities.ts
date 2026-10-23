import type { ActivityType } from '../composables/useActivities'

// Ordre de la navigation précédent / suivant des pages d'activité
export const ACTIVITY_ORDER: ActivityType[] = ['oa', 'tandem', 'soufflerie', 'pac']

export const adjacentActivities = (type: ActivityType) => {
  const index = ACTIVITY_ORDER.indexOf(type)
  const count = ACTIVITY_ORDER.length
  return {
    prev: ACTIVITY_ORDER[(index - 1 + count) % count] as ActivityType,
    next: ACTIVITY_ORDER[(index + 1) % count] as ActivityType,
  }
}

// Teinte de chaque activité (variables du thème, voir main.css)
export const ACTIVITY_CSS_VAR: Record<ActivityType, string> = {
  oa: 'var(--color-efreipara-oa)',
  tandem: 'var(--color-efreipara-tandem)',
  soufflerie: 'var(--color-efreipara-soufflerie)',
  pac: 'var(--color-efreipara-pac)',
}

export const activityColor = (type?: string) =>
  ACTIVITY_CSS_VAR[type as ActivityType] ?? 'var(--ui-primary)'

export const activityTint = (type: string | undefined, percent: number) =>
  `color-mix(in oklch, ${activityColor(type)} ${percent}%, transparent)`
