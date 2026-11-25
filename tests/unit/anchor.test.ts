import { describe, expect, it } from 'vitest'
import { isAtDestination, scrollDestination, toAnchorId } from '../../app/utils/anchor'

describe('toAnchorId', () => {
  it('met en minuscules et remplace les espaces par des tirets', () => {
    expect(toAnchorId('Le club')).toBe('le-club')
  })

  it('retire les accents', () => {
    expect(toAnchorId('Documents médicaux')).toBe('documents-medicaux')
    expect(toAnchorId('Sécurité')).toBe('securite')
  })

  it('retire la ponctuation', () => {
    expect(toAnchorId('Organisation & logistique')).toBe('organisation--logistique')
  })
})

describe('scrollDestination', () => {
  it('place l’ancre sous son scroll-mt', () => {
    expect(scrollDestination(500, { top: 1400, margin: 64, maxScroll: 5000 })).toBe(1836)
  })

  it('s’arrête au bas de la page pour une ancre trop basse', () => {
    expect(scrollDestination(500, { top: 1400, margin: 64, maxScroll: 1000 })).toBe(1000)
  })

  it('s’arrête en haut de la page', () => {
    expect(scrollDestination(100, { top: -300, margin: 64, maxScroll: 1000 })).toBe(0)
  })
})

describe('isAtDestination', () => {
  it('vrai quand l’ancre est sous son scroll-mt', () => {
    expect(isAtDestination(1836, { top: 64, margin: 64, maxScroll: 5000 })).toBe(true)
    expect(isAtDestination(1836, { top: 64.6, margin: 64, maxScroll: 5000 })).toBe(true)
  })

  it('vrai au bas de la page, même si l’ancre reste plus bas', () => {
    expect(isAtDestination(1000, { top: 900, margin: 64, maxScroll: 1000 })).toBe(true)
  })

  it('faux avant le départ d’un défilement vers le bas (scrollend d’un défilement précédent)', () => {
    expect(isAtDestination(0, { top: 1900, margin: 64, maxScroll: 2624 })).toBe(false)
  })
})
