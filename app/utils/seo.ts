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
    robots?: string
  }
  pages: Record<string, SeoPage>
}

export interface SeoPage {
  title: string
  description: string
  ogImage?: string
  robots?: string
  // Nom de la page dans les événements Plausible (utils/goals.ts), si le titre ne convient pas
  goal?: string
}

// Options SEO portées par le fichier de contenu d'une page (front-matter légal, option de « Nous rejoindre »)
export type SeoOverrides = Partial<SeoPage>

// `/` → `index`, `/activites/tandem` → `activites-tandem` (clés de seo.yml)
export const seoKeyFromPath = (path: string) =>
  path === '/' ? 'index' : path.slice(1).replace(/\//g, '-')

export const buildCanonicalUrl = (baseUrl: string, key: string) =>
  baseUrl
    ? `${baseUrl}${key === 'index' ? '' : '/' + key.replace('activites-', 'activites/')}`
    : undefined

// `/seo/x.png` → `https://efreipara.fr/seo/x.png` : les aperçus de partage exigent une URL absolue
export const toAbsoluteUrl = (baseUrl: string, path?: string) =>
  path && baseUrl && path.startsWith('/') && !path.startsWith('//')
    ? `${baseUrl.replace(/\/+$/, '')}${path}`
    : path

// Fusion defaults < seo.yml › pages.<clé> < options de la page (valeurs absentes ignorées)
export const buildSeoMeta = (seoData: SeoData, key: string, overrides: SeoOverrides = {}) => {
  const defaults = seoData.defaults
  const pageSeo: Partial<SeoPage> = { ...seoData.pages[key] }
  for (const [field, value] of Object.entries(overrides) as [keyof SeoPage, string | undefined][])
    if (value) pageSeo[field] = value

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

    robots: pageSeo?.robots || defaults.robots || 'index, follow',

    htmlLang: defaults.locale?.split('_')[0] || 'fr',
    themeColor: defaults.themeColor,
    canonicalUrl,
  }
}
