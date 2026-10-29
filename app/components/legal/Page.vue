<script setup lang="ts">
  import type { LegalCollectionItem } from '@nuxt/content'

  const props = defineProps<{ page: LegalCollectionItem }>()

  const { labels } = await useLabels()
  const toc = computed(() => props.page.body?.toc?.links ?? [])

  // Les liens du sommaire et des titres (ancres de Nuxt UI) font un router.push('#id') : interceptés
  // avant, pour un défilement doux sans « # » dans l'adresse ; le menu se referme sur téléphone
  const { scrollToId } = useSmoothScroll()
  const tocOpen = ref(false)
  const onAnchorClick = (event: MouseEvent) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
    if (!link) return
    event.preventDefault()
    event.stopPropagation()
    const id = decodeURIComponent(link.hash.slice(1))
    const wasOpen = tocOpen.value
    tocOpen.value = false
    // Le menu met 200 ms à se replier et fait remonter le texte : défiler une fois replié
    setTimeout(() => scrollToId(id, { focus: true }), wasOpen ? 220 : 0)
  }

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
      <!-- Texte sur 7 colonnes, sommaire collant sur 3 ; sur téléphone, sommaire repliable au-dessus -->
      <UPage :ui="{ center: 'lg:col-span-7', right: 'lg:col-span-3' }">
        <div
          class="legal-content select-text [&_h2]:outline-none [&_h2:first-child]:mt-0 [&_h3]:outline-none"
          @click.capture="onAnchorClick"
        >
          <ContentRenderer :value="page" />
        </div>
        <div
          v-if="page.updatedAt"
          class="border-default text-muted mt-12 border-t pt-6 text-sm select-text"
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
        <template v-if="toc.length" #right>
          <UContentToc
            v-model:open="tocOpen"
            :title="labels.legal.toc"
            :links="toc"
            highlight
            :ui="{ root: 'lg:h-fit', container: 'lg:pt-0' }"
            @click.capture="onAnchorClick"
          />
        </template>
      </UPage>
    </UContainer>
  </div>
</template>
