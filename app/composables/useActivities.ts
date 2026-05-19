/**
 * Types et composables liés aux activités du club
 */

// Type pour les différents types d'activités proposées
export type ActivityType = 'oa' | 'tandem' | 'soufflerie' | 'pac'

// Événement à venir affiché en bannière
export interface NextEvent {
  title: string
  date: string // Format YYYY-MM-DD
  type: ActivityType
  url: string // Lien d'inscription
}

/**
 * Composable pour obtenir l'icône associée à un type d'activité
 */
export const useEventIcon = () => {
  const appConfig = useAppConfig()

  const getIcon = (type: ActivityType): string => {
    return appConfig.efreipara.icons.activites[type]
  }

  return { getIcon }
}

/**
 * Composable pour obtenir la couleur thématique d'un type d'activité
 */
export const useActivityColor = () => {
  const getColor = (type: ActivityType): string => {
    const colors: Record<ActivityType, string> = {
      oa: 'efreipara-oa',
      tandem: 'efreipara-tandem',
      soufflerie: 'efreipara-soufflerie',
      pac: 'efreipara-pac',
    }
    return colors[type]
  }

  return { getColor }
}

/**
 * Composable pour gérer le prochain événement affiché en bannière
 */
export const useNextEvent = () => {
  const nextEvent: NextEvent = {
    title: 'Prochain évent : Saut en Tandem à Péronne le 12 Octobre',
    date: '2025-10-12',
    type: 'oa',
    url: 'https://forms.gle/4oymhf5YiAyywpmD7',
  }

  const { getIcon: getEventIcon } = useEventIcon()

  // Génère les styles UI personnalisés pour la bannière selon le type d'activité
  const getEventBannerUI = (type: ActivityType) => {
    const appConfig = useAppConfig()
    return appConfig.efreipara.colors[type]
  }

  // URL de la page d'information selon le type d'activité
  const getEventInfoUrl = (type: ActivityType): string => {
    return `/activites/${type}`
  }

  // Vérifier si l'événement doit être affiché (avant ou le jour-j)
  const shouldShowEvent = (): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const eventDate = new Date(nextEvent.date)
    eventDate.setHours(0, 0, 0, 0)

    return eventDate >= today
  }

  // Générer un ID unique pour la bannière basé sur la date et le type
  // Cela permet de réafficher la bannière à chaque nouvel événement
  const getEventBannerId = (): string => {
    return `event-${nextEvent.date}-${nextEvent.type}`
  }

  return {
    nextEvent,
    getEventIcon,
    getEventBannerUI,
    getEventInfoUrl,
    getEventBannerId,
    shouldShowEvent,
  }
}
