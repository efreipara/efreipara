/**
 * Composable pour gérer le SEO de manière centralisée
 *
 * @example
 * // app.vue : seo.yml, pour toutes les pages
 * useSeo(computed(() => seoKeyFromPath(route.path)))
 * // Page dont le fichier porte ses propres options : appelée après app.vue, elle l'emporte
 * useSeo(slug, () => ({ title: page.value?.title, description: page.value?.description }))
 */

export const useSeo = (
  pageKey: MaybeRefOrGetter<string>,
  overrides: MaybeRefOrGetter<SeoOverrides> = {},
) => {
  // Récupération des données SEO depuis le fichier seo.yml
  const { data: seoData, status } = useAsyncData('seo', () => queryCollection('seo').first())

  // Computed pour les métadonnées (réactif mais exécuté immédiatement en SSR)
  const seoMeta = computed(() =>
    seoData.value ? buildSeoMeta(seoData.value, toValue(pageKey), toValue(overrides)) : null,
  )

  const absolute = (path?: string) => toAbsoluteUrl(seoData.value?.defaults.baseUrl ?? '', path)

  // Application des métadonnées SEO
  useSeoMeta({
    title: computed(() => seoMeta.value?.title),
    description: computed(() => seoMeta.value?.description),
    author: computed(() => seoMeta.value?.author),

    // OpenGraph
    ogTitle: computed(() => seoMeta.value?.ogTitle),
    ogDescription: computed(() => seoMeta.value?.ogDescription),
    ogImage: computed(() => absolute(seoMeta.value?.ogImage)),
    ogType: computed(() => seoMeta.value?.ogType),
    ogSiteName: computed(() => seoMeta.value?.ogSiteName),
    ogUrl: computed(() => seoMeta.value?.ogUrl),
    ogLocale: computed(() => seoMeta.value?.ogLocale),

    // Twitter
    twitterCard: computed(() => seoMeta.value?.twitterCard),
    twitterTitle: computed(() => seoMeta.value?.twitterTitle),
    twitterDescription: computed(() => seoMeta.value?.twitterDescription),
    twitterImage: computed(() => absolute(seoMeta.value?.twitterImage)),

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
