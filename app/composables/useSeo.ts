/**
 * Composable pour gérer le SEO de manière centralisée
 *
 * @example
 * // Dans une page ou app.vue
 * useSeo(computed(() => route.path))
 */

export const useSeo = (pageKey: MaybeRefOrGetter<string>) => {
  // Récupération des données SEO depuis le fichier seo.yml
  const { data: seoData, status } = useAsyncData('seo', () => queryCollection('seo').first())

  // Computed pour les métadonnées (réactif mais exécuté immédiatement en SSR)
  const seoMeta = computed(() => {
    if (!seoData.value) return null

    const key = toValue(pageKey)
    const defaults = seoData.value.defaults
    const pageSeo = seoData.value.pages[key]

    // Fusion des données : defaults < page
    const title = pageSeo?.title || defaults.siteName
    const description = pageSeo?.description || ''
    const ogImage = pageSeo?.ogImage || defaults.ogImage

    // Construction du titre complet avec le nom du site
    const fullTitle = key === 'index' ? title : `${title}${defaults.separator}${defaults.siteName}`

    // Construction de l'URL canonique
    const canonicalUrl = defaults.baseUrl
      ? `${defaults.baseUrl}${key === 'index' ? '' : '/' + key.replace('activites-', 'activites/')}`
      : undefined

    return {
      title: fullTitle,
      description,
      author: defaults.author,

      // OpenGraph
      ogTitle: fullTitle,
      ogDescription: description,
      ogImage,
      ogType: defaults.ogType as 'website',
      ogSiteName: defaults.ogSiteName,
      ogUrl: canonicalUrl,
      ogLocale: defaults.locale,

      // Twitter
      twitterCard: defaults.twitterCard as 'summary_large_image',
      twitterTitle: fullTitle,
      twitterDescription: description,
      twitterImage: ogImage,

      // Robots
      robots: pageSeo?.robots || 'index, follow',

      // HTML attrs
      htmlLang: defaults.locale?.split('_')[0] || 'fr',
      themeColor: defaults.themeColor,
      canonicalUrl,
    }
  })

  // Application des métadonnées SEO
  useSeoMeta({
    title: computed(() => seoMeta.value?.title),
    description: computed(() => seoMeta.value?.description),
    author: computed(() => seoMeta.value?.author),

    // OpenGraph
    ogTitle: computed(() => seoMeta.value?.ogTitle),
    ogDescription: computed(() => seoMeta.value?.ogDescription),
    ogImage: computed(() => seoMeta.value?.ogImage),
    ogType: computed(() => seoMeta.value?.ogType),
    ogSiteName: computed(() => seoMeta.value?.ogSiteName),
    ogUrl: computed(() => seoMeta.value?.ogUrl),
    ogLocale: computed(() => seoMeta.value?.ogLocale),

    // Twitter
    twitterCard: computed(() => seoMeta.value?.twitterCard),
    twitterTitle: computed(() => seoMeta.value?.twitterTitle),
    twitterDescription: computed(() => seoMeta.value?.twitterDescription),
    twitterImage: computed(() => seoMeta.value?.twitterImage),

    // Robots
    robots: computed(() => seoMeta.value?.robots),
  })

  // Configuration supplémentaire pour le HTML
  useHead({
    htmlAttrs: {
      lang: computed(() => seoMeta.value?.htmlLang),
    },
    meta: computed(() =>
      seoMeta.value?.themeColor ? [{ name: 'theme-color', content: seoMeta.value.themeColor }] : [],
    ),
    link: computed(() =>
      seoMeta.value?.canonicalUrl ? [{ rel: 'canonical', href: seoMeta.value.canonicalUrl }] : [],
    ),
  })

  return { status }
}
