export interface SeoData {
  defaults: {
    siteName: string
    separator: string
    baseUrl: string
    ogImage: string
    ogType: string
    ogSiteName: string
    twitterCard: string
    locale: string
    themeColor: string
    author: string
  }
  pages: Record<string, { title: string; description: string; ogImage?: string; robots?: string }>
}

// `/` → `index`, `/activites/tandem` → `activites-tandem` (clés de seo.yml)
export const seoKeyFromPath = (path: string) =>
  path === '/' ? 'index' : path.slice(1).replace(/\//g, '-')

export const buildCanonicalUrl = (baseUrl: string, key: string) =>
  baseUrl
    ? `${baseUrl}${key === 'index' ? '' : '/' + key.replace('activites-', 'activites/')}`
    : undefined

// Fusion defaults < page
export const buildSeoMeta = (seoData: SeoData, key: string) => {
  const defaults = seoData.defaults
  const pageSeo = seoData.pages[key]

  const title = pageSeo?.title || defaults.siteName
  const description = pageSeo?.description || ''
  const ogImage = pageSeo?.ogImage || defaults.ogImage
  const fullTitle = key === 'index' ? title : `${title}${defaults.separator}${defaults.siteName}`
  const canonicalUrl = buildCanonicalUrl(defaults.baseUrl, key)

  return {
    title: fullTitle,
    description,
    author: defaults.author,

    ogTitle: fullTitle,
    ogDescription: description,
    ogImage,
    ogType: defaults.ogType as 'website',
    ogSiteName: defaults.ogSiteName,
    ogUrl: canonicalUrl,
    ogLocale: defaults.locale,

    twitterCard: defaults.twitterCard as 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: ogImage,

    robots: pageSeo?.robots || 'index, follow',

    htmlLang: defaults.locale?.split('_')[0] || 'fr',
    themeColor: defaults.themeColor,
    canonicalUrl,
  }
}
