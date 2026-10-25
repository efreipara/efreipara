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
  <div>
    <SharedPageHero
      :headline="labels.legal.headline"
      :title="page.title"
      :description="page.description"
    />
    <UContainer class="py-12 sm:py-16">
      <div class="legal-content max-w-3xl [&_h2:first-child]:mt-0">
        <ContentRenderer :value="page" />
      </div>
      <div
        v-if="page.updatedAt"
        class="border-default text-muted mt-12 max-w-3xl border-t pt-6 text-sm"
      >
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
  </div>
</template>
