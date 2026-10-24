<script setup lang="ts">
  // Page légale (collection legal) ou redirection (redirects.yml) ; toute autre adresse donne une 404
  const route = useRoute()
  const slug = route.params.slug as string

  const { data: legal } = await useAsyncData(`legal-${slug}`, () =>
    queryCollection('legal').path(`/${slug}`).first(),
  )
</script>

<template>
  <LegalPage v-if="legal" :page="legal" />
  <RedirectPage v-else :slug="slug" />
</template>
