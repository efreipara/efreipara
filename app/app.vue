<script setup lang="ts">
const route = useRoute()
const showLayout = computed(() => route.meta.layout !== false)

// SEO automatique basé sur le chemin de la route
const seoKey = computed(() => {
  const path = route.path === '/' ? 'index' : route.path.slice(1).replace(/\//g, '-')
  return path
})

useSeo(seoKey)
</script>

<template>
  <UApp>
    <EventBanner v-if="showLayout" />
    <AppHeader v-if="showLayout" />
    <UMain>
      <NuxtPage />
    </UMain>
    <AppFooter v-if="showLayout" />
  </UApp>
</template>
