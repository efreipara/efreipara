/**
 * Types et composable pour les partenaires du club
 */

import type { ActivityType } from './useActivities'

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
    return partners.value.filter((partner) => {
      if (partner.activites === undefined) return true
      if (partner.activites.length === 0) return false
      return partner.activites.includes(activity)
    })
  }

  return { partners, getPartnersByActivity }
}
