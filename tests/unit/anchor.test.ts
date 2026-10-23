import { describe, expect, it } from 'vitest'
import { toAnchorId } from '../../app/utils/anchor'

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
