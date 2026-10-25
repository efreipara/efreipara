import { describe, expect, it } from 'vitest'
import { isBandSection } from '../../app/utils/sections'

describe('isBandSection', () => {
  it('met une section sur deux sur bande, en commençant par la première', () => {
    expect([0, 1, 2, 3].map((i) => isBandSection(i))).toEqual([true, false, true, false])
  })

  it('commence par un fond clair quand ce qui précède est déjà sur bande', () => {
    expect([0, 1, 2, 3].map((i) => isBandSection(i, false))).toEqual([false, true, false, true])
  })

  it('ne met jamais sur bande une section absente (index -1)', () => {
    expect(isBandSection(-1)).toBe(false)
    expect(isBandSection(-1, false)).toBe(false)
  })
})
