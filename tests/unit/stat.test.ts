import { describe, expect, it } from 'vitest'
import { parseStatValue } from '../../app/utils/stat'

describe('parseStatValue', () => {
  it('sépare le nombre et le suffixe', () => {
    expect(parseStatValue('100+')).toEqual({ num: 100, suffix: '+' })
  })

  it('accepte un nombre seul', () => {
    expect(parseStatValue('2016')).toEqual({ num: 2016, suffix: '' })
    expect(parseStatValue(4)).toEqual({ num: 4, suffix: '' })
  })

  it('garde tout en suffixe sans nombre en tête', () => {
    expect(parseStatValue('~50')).toEqual({ num: 0, suffix: '~50' })
  })
})
