/**
 * Composables liés aux activités du club
 */

import type { ActivityType } from '~/utils/activities'

/**
 * Activités dans l'ordre d'affichage, avec ce que tout le site en montre (menu, icône, libellés)
 */
export const useActivities = async () => {
  const { data } = await useAsyncData('activites', () =>
    queryCollection('activites').select('stem', 'label', 'icon', 'galleryLabel', 'menu').all(),
  )

  const activities = computed(() => orderActivities(data.value ?? []))

  const byKey = (key: string) => activities.value.find((activity) => activity.key === key)

  const getIcon = (key: string) => byKey(key)?.icon ?? ''

  // Filtres et étiquettes de la galerie : galleryLabel, sinon label
  const getGalleryLabel = (key: string) => {
    const activity = byKey(key)
    return activity?.galleryLabel ?? activity?.label ?? key
  }

  return { activities, byKey, getIcon, getGalleryLabel }
}

/**
 * Composable pour gérer le prochain événement affiché en bannière
 */
export const useNextEvent = () => {
  const { data: event } = useAsyncData('nextEvent', () => queryCollection('nextEvent').first())

  const getEventInfoUrl = (type: ActivityType): string => {
    return `/activites/${type}`
  }

  const shouldShowEvent = (): boolean => !!event.value && isUpcomingEvent(event.value.date)

  const getEventBannerId = (): string => eventBannerId(event.value)

  return {
    event,
    getEventInfoUrl,
    getEventBannerId,
    shouldShowEvent,
  }
}
