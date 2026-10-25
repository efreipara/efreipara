<script setup lang="ts">
  const route = useRoute()
  // useLayout (Nuxt 4.5) : layout résolu de la route, réactif à la navigation et aux route rules
  const layout = useLayout()
  const showLayout = computed(() => layout.value !== false)

  const { features, init } = useAccessibility()
  onMounted(init)
  useHead({
    htmlAttrs: {
      class: computed(() =>
        (Object.entries(features.value) as [string, boolean][])
          .filter(([, v]) => v)
          .map(([k]) => `a11y-${k}`)
          .join(' '),
      ),
    },
  })

  const seoKey = computed(() => seoKeyFromPath(route.path))

  useSeo(seoKey)
</script>

<template>
  <UApp>
    <AppEventBanner v-if="showLayout" />
    <AppHeader v-if="showLayout" />
    <UMain>
      <NuxtPage />
    </UMain>
    <AppFooter v-if="showLayout" />
  </UApp>
</template>
