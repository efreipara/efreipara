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
