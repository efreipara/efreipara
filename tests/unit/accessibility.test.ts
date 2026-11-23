import { describe, expect, it } from 'vitest'
import { defaultAccessibility, isAdjusted, parseAccessibility } from '../../app/utils/accessibility'

describe('parseAccessibility', () => {
  it('reprend les options enregistrées', () => {
    expect(parseAccessibility('{"dyslexic":true,"highContrast":false,"seasonal":false}')).toEqual({
      dyslexic: true,
      highContrast: false,
      seasonal: false,
    })
  })

  it('complète une valeur partielle avec les options par défaut', () => {
    expect(parseAccessibility('{"highContrast":true}')).toEqual({
      dyslexic: false,
      highContrast: true,
      seasonal: true,
    })
  })

  it('revient aux options par défaut sans valeur ou avec une valeur illisible', () => {
    expect(parseAccessibility(null)).toEqual(defaultAccessibility)
    expect(parseAccessibility('{oops')).toEqual(defaultAccessibility)
    expect(parseAccessibility('null')).toEqual(defaultAccessibility)
    expect(parseAccessibility('42')).toEqual(defaultAccessibility)
  })

  it('ignore les clés inconnues et les valeurs non booléennes', () => {
    expect(
      parseAccessibility('{"dyslexic":"oui","highContrast":1,"__proto__":{"x":true},"autre":true}'),
    ).toEqual(defaultAccessibility)
  })
})

describe('isAdjusted', () => {
  it('signale une option écartée de sa valeur par défaut, dans un sens ou dans l’autre', () => {
    expect(isAdjusted(defaultAccessibility, 'dyslexic')).toBe(false)
    expect(isAdjusted(defaultAccessibility, 'seasonal')).toBe(false)
    expect(isAdjusted({ ...defaultAccessibility, dyslexic: true }, 'dyslexic')).toBe(true)
    expect(isAdjusted({ ...defaultAccessibility, seasonal: false }, 'seasonal')).toBe(true)
  })
})
