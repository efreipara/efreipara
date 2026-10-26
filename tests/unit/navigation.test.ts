import { describe, expect, it } from 'vitest'
import { sortHeaderLinks } from '../../app/utils/navigation'

describe('sortHeaderLinks', () => {
  it('ne garde que les pages qui ont un champ header, triées par sa valeur', () => {
    const pages = [
      { label: 'À propos' },
      { label: 'Rejoindre', header: 4 },
      { label: 'Documents', header: 1 },
      { label: 'Contact' },
      { label: 'FAQ', header: 3 },
    ]
    expect(sortHeaderLinks(pages).map((page) => page.label)).toEqual([
      'Documents',
      'FAQ',
      'Rejoindre',
    ])
  })

  it('accepte une liste vide', () => {
    expect(sortHeaderLinks([])).toEqual([])
  })
})
