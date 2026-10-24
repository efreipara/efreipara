<script setup lang="ts">
  import type { LegalCollectionItem } from '@nuxt/content'

  const props = defineProps<{ page: LegalCollectionItem }>()

  const { labels } = await useLabels()

  // Titre et description du front-matter
  useSeo(seoKeyFromPath(props.page.path), () => ({
    title: props.page.title,
    description: props.page.description,
  }))
</script>

<template>
  <UContainer class="mt-15 max-w-4xl px-4 py-8">
    <div class="legal-content">
      <ContentRenderer :value="page" />
    </div>
    <div v-if="page.updatedAt" class="border-default text-muted mt-12 border-t pt-6 text-sm">
      {{ labels.legal.updatedAt }}
      {{
        new Date(page.updatedAt).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }}
    </div>
  </UContainer>
</template>
