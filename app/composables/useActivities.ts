/**
 * Types et composables liés aux activités du club
 */

import type { ActivityType } from '~/utils/activities'

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

  const shouldShowEvent = (): boolean => !!event.value && isUpcomingEvent(event.value.date)

  const getEventBannerId = (): string => eventBannerId(event.value)

  return {
    event,
    getEventIcon,
    getEventBannerUI,
    getEventInfoUrl,
    getEventBannerId,
    shouldShowEvent,
  }
}
