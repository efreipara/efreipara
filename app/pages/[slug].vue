<script setup lang="ts">
  // Page légale (collection legal) ou redirection (redirects.yml) ; toute autre adresse donne une 404
  const route = useRoute()
  const slug = route.params.slug as string

  // Page légale de la langue, sinon celle de la langue par défaut (OPTIONAL_TRANSLATIONS)
  const { data: legal } = await useContentData('legal', {
    key: `legal-${slug}`,
    query: async (q, locale) => {
      const page = await q.path(`/${slug}`).first()
      if (page || locale === DEFAULT_LOCALE) return page && { page, lang: locale }
      const fallback = await queryCollection(localizedCollection('legal', DEFAULT_LOCALE))
        .path(`/${slug}`)
        .first()
      return fallback && { page: fallback, lang: DEFAULT_LOCALE }
    },
  })
</script>

<template>
  <LegalPage v-if="legal" :page="legal.page" :lang="legal.lang" />
  <RedirectPage v-else :slug="slug" />
</template>
