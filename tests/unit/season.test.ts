import { describe, expect, it } from 'vitest'
import { activeSeason, isInSeason, isMonthDay } from '../../app/utils/season'

const day = (month: number, date: number) => new Date(2026, month - 1, date, 12)

describe('isMonthDay', () => {
  it('accepte un jour MM-JJ réel, 29 février compris', () => {
    expect(isMonthDay('12-01')).toBe(true)
    expect(isMonthDay('02-29')).toBe(true)
  })

  it('refuse un jour impossible ou mal écrit', () => {
    expect(isMonthDay('02-30')).toBe(false)
    expect(isMonthDay('13-01')).toBe(false)
    expect(isMonthDay('00-10')).toBe(false)
    expect(isMonthDay('12-1')).toBe(false)
    expect(isMonthDay('2026-12-01')).toBe(false)
  })
})

describe('isInSeason', () => {
  const december = { start: '12-01', end: '12-31' }

  it('inclut les deux bornes', () => {
    expect(isInSeason(december, day(12, 1))).toBe(true)
    expect(isInSeason(december, day(12, 31))).toBe(true)
    expect(isInSeason(december, day(11, 30))).toBe(false)
    expect(isInSeason(december, day(1, 1))).toBe(false)
  })

  it('gère une période qui passe le 31 décembre', () => {
    const holidays = { start: '12-20', end: '01-05' }
    expect(isInSeason(holidays, day(12, 25))).toBe(true)
    expect(isInSeason(holidays, day(1, 5))).toBe(true)
    expect(isInSeason(holidays, day(1, 6))).toBe(false)
    expect(isInSeason(holidays, day(12, 19))).toBe(false)
  })
})

describe('activeSeason', () => {
  const items = [
    { key: 'hiver', start: '12-01', end: '12-31' },
    { key: 'fetes', start: '12-20', end: '01-05' },
  ]

  it('renvoie la première saison qui contient le jour', () => {
    expect(activeSeason(items, day(12, 24))?.key).toBe('hiver')
    expect(activeSeason(items, day(1, 2))?.key).toBe('fetes')
  })

  it('renvoie null hors saison ou sans saison', () => {
    expect(activeSeason(items, day(7, 14))).toBeNull()
    expect(activeSeason([], day(12, 24))).toBeNull()
  })
})
