/**
 * Types et composable pour les partenaires du club
 */

import type { ActivityType } from './useActivities'

// Partenaire du club avec logo et activités associées
export interface Partner {
  name: string
  logo?: string
  icon?: string
  url: string
  activites?: ActivityType[] // Activités concernées (tableau vide = aucune, undefined = toutes)
}

/**
 * Composable pour gérer les partenaires du club
 */
export const usePartners = () => {
  const partners: Partner[] = [
    {
      name: 'Efrei',
      icon: 'efrei:logo-color',
      url: 'https://efrei.fr/',
    },
    {
      name: 'Skydive Event Paris',
      logo: '/partners/skydive-event.webp',
      url: 'https://www.skydiveevent-paris.fr',
      activites: ['tandem'],
    },
    {
      name: 'iFly',
      icon: 'ifly:logo-color',
      url: 'https://www.iflyfrance.com/lieux/ifly-paris/',
      activites: ['soufflerie'],
    },
  ]

  // Fonction pour filtrer les partenaires par activité
  const getPartnersByActivity = (activity: ActivityType) => {
    return partners.filter((partner) => {
      if (partner.activites === undefined) return true
      if (partner.activites.length === 0) return false
      return partner.activites.includes(activity)
    })
  }

  return { partners, getPartnersByActivity }
}
