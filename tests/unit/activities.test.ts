import { describe, expect, it } from 'vitest'
import {
  ACTIVITY_ORDER,
  activityColor,
  activityTint,
  activityClass,
  adjacentActivities,
  orderActivities,
} from '../../app/utils/activities'

describe('adjacentActivities', () => {
  it('donne les voisines dans l’ordre OA, tandem, soufflerie, PAC', () => {
    expect(ACTIVITY_ORDER).toEqual(['oa', 'tandem', 'soufflerie', 'pac'])
    expect(adjacentActivities('tandem')).toEqual({ prev: 'oa', next: 'soufflerie' })
  })

  it('boucle aux deux bouts de la liste', () => {
    expect(adjacentActivities('oa')).toEqual({ prev: 'pac', next: 'tandem' })
    expect(adjacentActivities('pac')).toEqual({ prev: 'soufflerie', next: 'oa' })
  })
})

describe('activityColor', () => {
  it('donne la variable CSS de l’activité', () => {
    expect(activityColor('tandem')).toBe('var(--color-efreipara-tandem)')
  })

  it('retombe sur la couleur primaire pour un type inconnu ou absent', () => {
    expect(activityColor('inconnu')).toBe('var(--ui-primary)')
    expect(activityColor(undefined)).toBe('var(--ui-primary)')
  })
})

describe('activityTint', () => {
  it('mélange la teinte de l’activité avec du transparent', () => {
    expect(activityTint('pac', 15)).toBe(
      'color-mix(in oklch, var(--color-efreipara-pac) 15%, transparent)',
    )
  })
})

describe('activityClass', () => {
  it('donne la classe qui pose la variable --activity', () => {
    expect(activityClass('oa')).toBe('activity-oa')
  })

  it('ne donne aucune classe pour un type inconnu ou absent (repli sur la couleur primaire)', () => {
    expect(activityClass('inconnu')).toBe('')
    expect(activityClass('constructor')).toBe('')
    expect(activityClass(undefined)).toBe('')
  })
})

describe('orderActivities', () => {
  it('tire la clé du nom de fichier, ajoute le lien et suit l’ordre des clés', () => {
    const items = [
      { stem: 'pages/activites/oa' },
      { stem: 'pages/activites/tandem' },
      { stem: 'pages/activites/inconnu' },
    ]
    expect(orderActivities(items)).toEqual([
      { stem: 'pages/activites/tandem', key: 'tandem', to: '/activites/tandem' },
      { stem: 'pages/activites/oa', key: 'oa', to: '/activites/oa' },
    ])
  })
})
