export interface GalleryItem {
  title: string
  type: string
  date: string
  location: string
  url: string
  photo?: string
  source?: string
}

export const galleryTypes = (items: GalleryItem[]) => [...new Set(items.map((item) => item.type))]

// Plus récent d'abord
export const filterGallery = <T extends GalleryItem>(items: T[], filter: string | null) =>
  (filter ? items.filter((item) => item.type === filter) : [...items]).sort((a, b) =>
    b.date.localeCompare(a.date),
  )

// Premier album mis en avant : sans filtre et à partir de trois albums
export const hasGalleryHeroLayout = (filter: string | null, count: number) =>
  filter ? false : count >= 3

// Photo de repli sur le CDN
export const galleryFallbackPath = (item: Pick<GalleryItem, 'type' | 'date'>) =>
  `${item.type}/${item.date}.jpg`
