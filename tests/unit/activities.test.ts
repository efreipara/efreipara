import { describe, expect, it } from 'vitest'
import { ACTIVITY_ORDER, adjacentActivities } from '../../app/utils/activities'

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
