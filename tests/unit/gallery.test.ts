import { describe, expect, it } from 'vitest'
import {
  filterGallery,
  galleryFallbackPath,
  galleryTypes,
  hasGalleryHeroLayout,
  type GalleryItem,
} from '../../app/utils/gallery'

const album = (type: string, date: string): GalleryItem => ({
  title: `${type} ${date}`,
  type,
  date,
  location: 'Paris',
  url: `https://example.org/${type}-${date}`,
})

const items = [
  album('soufflerie', '2025-02-07'),
  album('tandem', '2025-05-18'),
  album('soufflerie', '2026-03-06'),
]

describe('galleryTypes', () => {
  it('liste chaque type une fois, dans leur ordre d’apparition', () => {
    expect(galleryTypes(items)).toEqual(['soufflerie', 'tandem'])
  })
})

describe('filterGallery', () => {
  it('trie du plus récent au plus ancien', () => {
    expect(filterGallery(items, null).map((item) => item.date)).toEqual([
      '2026-03-06',
      '2025-05-18',
      '2025-02-07',
    ])
  })

  it('ne garde que le type filtré', () => {
    expect(filterGallery(items, 'soufflerie').map((item) => item.date)).toEqual([
      '2026-03-06',
      '2025-02-07',
    ])
  })

  it('ne modifie pas la liste reçue', () => {
    const copy = [...items]
    filterGallery(items, null)
    expect(items).toEqual(copy)
  })
})

describe('hasGalleryHeroLayout', () => {
  it('met le premier album en avant sans filtre, à partir de trois albums', () => {
    expect(hasGalleryHeroLayout(null, 3)).toBe(true)
  })

  it('ne le fait pas avec moins de trois albums', () => {
    expect(hasGalleryHeroLayout(null, 2)).toBe(false)
  })

  it('ne le fait pas quand un filtre est actif', () => {
    expect(hasGalleryHeroLayout('tandem', 5)).toBe(false)
  })
})

describe('galleryFallbackPath', () => {
  it('construit <type>/<date>.jpg', () => {
    expect(galleryFallbackPath({ type: 'tandem', date: '2025-05-18' })).toBe(
      'tandem/2025-05-18.jpg',
    )
  })
})
