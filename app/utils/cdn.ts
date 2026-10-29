// Largeurs de chaque photo du CDN (<chemin>-<largeur>.webp), produites par scripts/cdn-build.ts
export const CDN_IMAGE_WIDTHS = [480, 960, 1600] as const

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
