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
  const { data: seoData, status } = useAsyncData('seo', () => queryCollection('seo').first())

  const seoMeta = computed(() =>
    seoData.value ? buildSeoMeta(seoData.value, toValue(pageKey), toValue(overrides)) : null,
  )

  const absolute = (path?: string) => toAbsoluteUrl(seoData.value?.defaults.baseUrl ?? '', path)

  useSeoMeta({
    title: computed(() => seoMeta.value?.title),
    description: computed(() => seoMeta.value?.description),
    author: computed(() => seoMeta.value?.author),

    ogTitle: computed(() => seoMeta.value?.ogTitle),
    ogDescription: computed(() => seoMeta.value?.ogDescription),
    ogImage: computed(() => absolute(seoMeta.value?.ogImage)),
    ogType: computed(() => seoMeta.value?.ogType),
    ogSiteName: computed(() => seoMeta.value?.ogSiteName),
    ogUrl: computed(() => seoMeta.value?.ogUrl),
    ogLocale: computed(() => seoMeta.value?.ogLocale),

    twitterCard: computed(() => seoMeta.value?.twitterCard),
    twitterTitle: computed(() => seoMeta.value?.twitterTitle),
    twitterDescription: computed(() => seoMeta.value?.twitterDescription),
    twitterImage: computed(() => absolute(seoMeta.value?.twitterImage)),

    robots: computed(() => seoMeta.value?.robots),
  })

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
