/**
 * Types et composable pour les partenaires du club
 */

import type { ActivityType } from '~/utils/activities'

export interface Partner {
  name: string
  logo?: string
  icon?: string
  url: string
  activites?: ActivityType[]
}

/**
 * Composable pour gérer les partenaires du club
 */
export const usePartners = async () => {
  const { data } = await useAsyncData('partners', () => queryCollection('partners').first())

  const partners = computed(() => data.value?.items ?? [])

  const getPartnersByActivity = (activity: ActivityType) => {
    return partners.value.filter((partner) => partner.activites?.includes(activity) ?? false)
  }

  return { partners, getPartnersByActivity }
}
