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
 * Événements à venir (global/events.yml), triés, d'une seule activité si `type` est donné.
 * Date du jour : celle du generate (dans le payload, même rendu au prérendu et à l'hydratation),
 * puis celle du navigateur : un événement passé depuis le dernier generate disparaît.
 */
export const useUpcomingEvents = async (type?: ActivityType) => {
  // Avant l'await : le contexte Nuxt et le composant ne sont plus connus après
  const today = useState('events-today', () => new Date().toISOString())
  onMounted(() => (today.value = new Date().toISOString()))
  const { data } = await useAsyncData('events', () => queryCollection('events').first())

  const events = computed(() =>
    upcomingEvents(data.value?.items ?? [], new Date(today.value), type),
  )

  return { events }
}
