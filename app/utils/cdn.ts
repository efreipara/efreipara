// Largeurs de chaque photo du CDN (<chemin>-<largeur>.webp), produites par scripts/cdn-build.ts
export const CDN_IMAGE_WIDTHS = [480, 960, 1600] as const
export type CdnImageWidth = (typeof CDN_IMAGE_WIDTHS)[number]

// Emplacement d'une photo : largeur affichée (`sizes`, conteneur de 1 216 px utiles) et plafond.
// Une photo qui reste petite s'arrête à 960 (×2,2 au moins) : la 1600 pèse près du double.
// Sous 640 px, `sizes` annonce 320px : un téléphone ×3 prend la 960, pas la 1600.
export const CDN_IMAGE_LAYOUTS = {
  // Moitié du conteneur en lg : héros d'activité, sections côte à côte, appel à l'action
  half: {
    sizes: '(min-width: 1280px) 576px, (min-width: 1024px) 50vw, (min-width: 640px) 100vw, 320px',
    max: 1600,
  },
  // Deux colonnes dès sm : cartes de /rejoindre
  pair: { sizes: '(min-width: 1280px) 596px, (min-width: 640px) 50vw, 320px', max: 1600 },
  // Album mis en avant : deux colonnes sur trois en lg
  featured: {
    sizes: '(min-width: 1280px) 806px, (min-width: 1024px) 66vw, (min-width: 640px) 50vw, 320px',
    max: 1600,
  },
  // Trois colonnes en lg : carrousel, albums
  third: {
    sizes: '(min-width: 1280px) 395px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
    max: 960,
  },
  // Quatre colonnes en lg : cartes d'activité de l'accueil
  quarter: {
    sizes: '(min-width: 1280px) 290px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw',
    max: 960,
  },
} as const satisfies Record<string, { sizes: string; max: CdnImageWidth }>
export type CdnImageLayout = keyof typeof CDN_IMAGE_LAYOUTS

export const cdnImagePath = (base: string, width: CdnImageWidth) => `${base}-${width}.webp`

// Largeurs jusqu'à `max` ; vide sans CDN (urlFor renvoie '')
export const cdnSrcset = (
  urlFor: (path: string) => string,
  base: string,
  max: CdnImageWidth = 1600,
) => {
  const widths = CDN_IMAGE_WIDTHS.filter((width) => width <= max)
  const urls = widths.map((width) => urlFor(cdnImagePath(base, width)))
  return urls.every(Boolean) ? urls.map((url, i) => `${url} ${widths[i]}w`).join(', ') : ''
}

export const resolveCdnUrl = ({
  baseUrl,
  path,
  devToken = '',
  isDev = false,
}: {
  baseUrl: string
  path: string
  devToken?: string
  isDev?: boolean
}) => {
  const base = baseUrl.replace(/\/+$/, '')
  if (!base) return ''

  const rawUrl = `${base}/${path.replace(/^\/+/, '')}`
  const token = devToken.trim()

  // Jeton anti-hotlink : en dev uniquement, et seulement s'il est fourni
  if (!isDev || !token) return rawUrl

  const separator = rawUrl.includes('?') ? '&' : '?'
  return `${rawUrl}${separator}token=${encodeURIComponent(token)}`
}
