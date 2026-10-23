import { describe, expect, it } from 'vitest'
import { categoryColorClasses } from '../../app/utils/category-color'

describe('categoryColorClasses', () => {
  it('donne les classes d’une couleur connue', () => {
    expect(categoryColorClasses('green')).toEqual({
      bg: 'bg-green-500/10',
      text: 'text-green-500',
      hoverBg: 'hover:bg-green-500/20',
    })
  })

  it('se rabat sur la couleur primaire pour une couleur inconnue ou absente', () => {
    const primary = { bg: 'bg-primary/10', text: 'text-primary', hoverBg: 'hover:bg-primary/20' }
    expect(categoryColorClasses('rose')).toEqual(primary)
    expect(categoryColorClasses()).toEqual(primary)
  })
})
