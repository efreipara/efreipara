/**
 * Types et composables liés aux activités du club
 */

// Type pour les différents types d'activités proposées
export type ActivityType = 'oa' | 'tandem' | 'soufflerie' | 'pac'

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
  const { data: event } = useAsyncData('nextEvent', () => queryCollection('nextEvent').first())

  const { getIcon: getEventIcon } = useEventIcon()

  const getEventBannerUI = (type: ActivityType) => {
    const appConfig = useAppConfig()
    return appConfig.efreipara.colors[type]
  }

  const getEventInfoUrl = (type: ActivityType): string => {
    return `/activites/${type}`
  }

  const shouldShowEvent = (): boolean => {
    if (!event.value) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventDate = new Date(event.value.date)
    eventDate.setHours(0, 0, 0, 0)
    return eventDate >= today
  }

  const getEventBannerId = (): string => {
    return `event-${event.value?.date}-${event.value?.type}`
  }

  return {
    event,
    getEventIcon,
    getEventBannerUI,
    getEventInfoUrl,
    getEventBannerId,
    shouldShowEvent,
  }
}
