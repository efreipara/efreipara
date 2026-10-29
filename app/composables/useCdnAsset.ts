import type { CdnImageLayout } from '~/utils/cdn'

export const useCdnAsset = () => {
  const config = useRuntimeConfig()

  const buildCdnUrl = (path: string) =>
    resolveCdnUrl({
      baseUrl: String(config.public.cdnUrl || ''),
      devToken: String(config.public.cdnDevToken || ''),
      isDev: import.meta.dev,
      path,
    })

  // Photo du CDN (base sans largeur ni extension), à lier par v-bind sur <img>
  const cdnImage = (base: string, layout: CdnImageLayout) => {
    const { sizes, max } = CDN_IMAGE_LAYOUTS[layout]
    const srcset = cdnSrcset(buildCdnUrl, base, max)
    return {
      src: buildCdnUrl(cdnImagePath(base, 960)),
      srcset: srcset || undefined,
      sizes: srcset ? sizes : undefined,
    }
  }

  return {
    buildCdnUrl,
    cdnImage,
  }
}
