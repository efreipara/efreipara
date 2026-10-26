// Clés d'activité dans l'ordre d'affichage : source unique pour l'app, les schémas et les tests
export const ACTIVITY_KEYS = ['tandem', 'soufflerie', 'pac', 'oa'] as const

export type ActivityType = (typeof ACTIVITY_KEYS)[number]

export const isActivity = (value: unknown): value is ActivityType =>
  typeof value === 'string' && (ACTIVITY_KEYS as readonly string[]).includes(value)

// Entrées de la collection `activites` : clé (nom du fichier), lien, ordre de ACTIVITY_KEYS
export const orderActivities = <T extends { stem: string }>(items: T[]) =>
  items
    .map((item) => {
      const key = item.stem.split('/').pop() as ActivityType
      return { ...item, key, to: `/activites/${key}` }
    })
    .filter((item) => isActivity(item.key))
    .sort((a, b) => ACTIVITY_KEYS.indexOf(a.key) - ACTIVITY_KEYS.indexOf(b.key))

// Activités voisines (précédent / suivant), en boucle
export const adjacentActivities = (type: ActivityType) => {
  const index = ACTIVITY_KEYS.indexOf(type)
  const count = ACTIVITY_KEYS.length
  return {
    prev: ACTIVITY_KEYS[(index - 1 + count) % count] as ActivityType,
    next: ACTIVITY_KEYS[(index + 1) % count] as ActivityType,
  }
}

// Teinte de chaque activité (variables du thème, voir main.css)
export const ACTIVITY_CSS_VAR = Object.fromEntries(
  ACTIVITY_KEYS.map((key) => [key, `var(--color-efreipara-${key})`]),
) as Record<ActivityType, string>

export const activityColor = (type?: string) =>
  ACTIVITY_CSS_VAR[type as ActivityType] ?? 'var(--ui-primary)'

export const activityTint = (type: string | undefined, percent: number) =>
  `color-mix(in oklch, ${activityColor(type)} ${percent}%, transparent)`

// Classe qui pose --activity (main.css) : ses descendants l'utilisent via bg-tint-*, text-activity, bg-activity
export const activityClass = (type?: string) =>
  type && Object.hasOwn(ACTIVITY_CSS_VAR, type) ? `activity-${type}` : ''
