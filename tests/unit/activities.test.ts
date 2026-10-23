import { describe, expect, it } from 'vitest'
import {
  ACTIVITY_ORDER,
  activityColor,
  activityTint,
  activityVars,
  adjacentActivities,
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

describe('activityVars', () => {
  it('pose la variable --activity lue par les utilitaires de teinte', () => {
    expect(activityVars('oa')).toEqual({ '--activity': 'var(--color-efreipara-oa)' })
    expect(activityVars(undefined)).toEqual({ '--activity': 'var(--ui-primary)' })
  })
})
