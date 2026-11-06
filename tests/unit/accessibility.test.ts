import { describe, expect, it } from 'vitest'
import { defaultAccessibility, parseAccessibility } from '../../app/utils/accessibility'

describe('parseAccessibility', () => {
  it('reprend les options enregistrées', () => {
    expect(parseAccessibility('{"dyslexic":true,"highContrast":false}')).toEqual({
      dyslexic: true,
      highContrast: false,
    })
  })

  it('complète une valeur partielle avec les options par défaut', () => {
    expect(parseAccessibility('{"highContrast":true}')).toEqual({
      dyslexic: false,
      highContrast: true,
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
