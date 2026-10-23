import { describe, expect, it } from 'vitest'
import { eventBannerId, isUpcomingEvent } from '../../app/utils/event'

const today = new Date('2026-10-12T15:30:00')

describe('isUpcomingEvent', () => {
  it('affiche un événement à venir', () => {
    expect(isUpcomingEvent('2026-10-20', today)).toBe(true)
  })

  it("affiche l'événement le jour même, quelle que soit l'heure", () => {
    expect(isUpcomingEvent('2026-10-12', today)).toBe(true)
  })

  it('masque un événement passé', () => {
    expect(isUpcomingEvent('2026-10-11', today)).toBe(false)
  })
})

describe('eventBannerId', () => {
  it('dépend de la date et du type', () => {
    expect(eventBannerId({ date: '2026-10-12', type: 'tandem' })).toBe('event-2026-10-12-tandem')
  })

  it("change quand l'événement change", () => {
    expect(eventBannerId({ date: '2026-10-12', type: 'tandem' })).not.toBe(
      eventBannerId({ date: '2026-11-05', type: 'tandem' }),
    )
  })
})
