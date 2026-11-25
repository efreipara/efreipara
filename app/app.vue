<script setup lang="ts">
  import type { AccessibilityFeatures } from '~/utils/accessibility'

  const route = useRoute()
  // useLayout (Nuxt 4.5) : layout résolu de la route, réactif à la navigation et aux route rules
  const layout = useLayout()
  const showLayout = computed(() => layout.value !== false)

  const { features, init } = useAccessibility()
  onMounted(init)
  useHead({
    htmlAttrs: {
      // Classe pour les options activées à la demande (les décorations de saison sont lues ailleurs)
      class: computed(() =>
        (Object.entries(features.value) as [keyof AccessibilityFeatures, boolean][])
          .filter(([k, v]) => v && !defaultAccessibility[k])
          .map(([k]) => `a11y-${k}`)
          .join(' '),
      ),
    },
  })

  // Clé de seo.yml tirée de l'adresse française de la page : mêmes clés dans toutes les langues
  const switchLocalePath = useSwitchLocalePath()
  const seoKey = computed(() => seoKeyFromPath(switchLocalePath(DEFAULT_LOCALE) || route.path))

  useSeo(seoKey)

  // Versions de la page dans les autres langues publiées (hreflang, og:locale:alternate) ;
  // lang, og:locale et canonique restent ceux de useSeo
  if (ENABLED_LOCALES.length > 1) {
    const localeHead = useLocaleHead({ lang: false, dir: false })
    useHead({
      link: computed(() =>
        (localeHead.value.link ?? []).filter((link) => link.rel === 'alternate'),
      ),
      meta: computed(() =>
        (localeHead.value.meta ?? []).filter((meta) => meta.property === 'og:locale:alternate'),
      ),
    })
  }
</script>

<template>
  <UApp>
    <AppEventBanner v-if="showLayout" />
    <AppHeader v-if="showLayout" />
    <AppSeasonalDecor v-if="showLayout" />
    <UMain>
      <NuxtPage />
    </UMain>
    <AppFooter v-if="showLayout" />
  </UApp>
</template>
