import { describe, expect, it } from 'vitest'
import { categoryColorClasses, categoryTextClass } from '../../app/utils/category-color'

describe('categoryColorClasses', () => {
  it('donne les classes d’une couleur connue', () => {
    expect(categoryColorClasses('green')).toEqual({
      bg: 'bg-green-500/10',
      text: 'text-green-500',
      hoverBg: 'hover:bg-green-500/20',
      rowHover: 'hover:bg-green-500/5',
      bar: 'before:bg-green-500',
    })
  })

  it('se rabat sur la couleur primaire pour une couleur inconnue ou absente', () => {
    const primary = {
      bg: 'bg-primary/10',
      text: 'text-primary',
      hoverBg: 'hover:bg-primary/20',
      rowHover: 'hover:bg-primary/5',
      bar: 'before:bg-primary',
    }
    expect(categoryColorClasses('rose')).toEqual(primary)
    expect(categoryColorClasses()).toEqual(primary)
  })
})

describe('categoryTextClass', () => {
  it('assombrit le texte en clair et l’éclaircit en sombre', () => {
    expect(categoryTextClass('green')).toBe('text-green-800 dark:text-green-400')
    expect(categoryTextClass('gray')).toBe('text-gray-700 dark:text-gray-400')
  })

  it('se rabat sur la couleur primaire pour une couleur inconnue ou absente', () => {
    expect(categoryTextClass('rose')).toBe('text-primary')
    expect(categoryTextClass()).toBe('text-primary')
  })
})
