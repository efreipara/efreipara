<script setup lang="ts">
  const { getIcon, getGalleryLabel } = await useActivities()

  const { data: page } = await useAsyncData('galerie', () => queryCollection('galerie').first())

  const activeFilter = ref<string | null>(null)

  const activityTypes = computed(() => galleryTypes(page.value?.items ?? []))

  const filteredItems = computed(() => filterGallery(page.value?.items ?? [], activeFilter.value))

  const showHeroLayout = computed(() =>
    hasGalleryHeroLayout(activeFilter.value, filteredItems.value.length),
  )

  const cardLabels = computed(() => ({
    link: page.value?.hero.linkLabel ?? '',
    linkSource: page.value?.hero.linkSourceLabel ?? '',
  }))

  // Nom de transition stable par album (rang dans galerie.yml)
  const albumIndex = computed(
    () => new Map((page.value?.items ?? []).map((item, i) => [item.url, i])),
  )

  // Changement de filtre en transition de vue : les albums glissent vers leur place, la carte mise
  // en avant se redimensionne. Les noms ne sont posés que pendant la transition, pour ne pas
  // perturber le cercle de la bascule clair / sombre ; immédiat sans l'API ou avec « réduire les
  // animations ». Un clic pendant une transition la remplace : seule la dernière retire les noms.
  const animating = ref(false)
  let lastTransition = 0
  const setFilter = async (value: string | null) => {
    const doc = document as Document & {
      startViewTransition?: (update: () => Promise<void>) => { finished: Promise<void> }
    }
    if (value === activeFilter.value) return
    if (!doc.startViewTransition || prefersReducedMotion()) {
      activeFilter.value = value
      return
    }
    const id = ++lastTransition
    animating.value = true
    document.documentElement.classList.add('gallery-transition')
    await nextTick()
    const transition = doc.startViewTransition(async () => {
      activeFilter.value = value
      await nextTick()
    })
    const cleanup = () => {
      if (id !== lastTransition) return
      animating.value = false
      document.documentElement.classList.remove('gallery-transition')
    }
    transition.finished.then(cleanup, cleanup)
  }
</script>

<template>
  <div>
    <SharedPageHero
      :headline="page?.hero.headline"
      :title="page?.hero.title"
      :description="page?.hero.description"
    />

    <UContainer class="py-12 sm:py-16">
      <div class="mb-8 flex flex-wrap gap-2">
        <UButton
          :label="page?.hero.allLabel"
          variant="filter"
          :aria-pressed="!activeFilter"
          @click="setFilter(null)"
        />
        <!-- Filtre actif : fond plein de l'activité -->
        <UButton
          v-for="type in activityTypes"
          :key="type"
          :icon="getIcon(type)"
          :label="getGalleryLabel(type)"
          variant="filter"
          :aria-pressed="activeFilter === type"
          class="text-activity-strong ring-tint-45 aria-pressed:bg-activity aria-pressed:text-on-activity"
          :class="activityClass(type)"
          @click="setFilter(activeFilter === type ? null : type)"
        />
      </div>

      <!-- Nombre d'albums affichés, dans la teinte de l'activité filtrée ; annoncé à chaque filtre -->
      <SharedHeadline
        v-if="page?.count"
        :tone="activeFilter ? 'text-activity-strong' : undefined"
        :class="activeFilter && activityClass(activeFilter)"
        aria-live="polite"
        class="mb-6"
      >
        {{ countLabel(filteredItems.length, page.count) }}
      </SharedHeadline>

      <UPageGrid class="gap-4">
        <!-- Premier élément : 2 colonnes × 2 lignes sur lg quand la mise en avant s'applique -->
        <SharedAlbumCard
          v-for="(item, index) in filteredItems"
          :key="item.url"
          :item="item"
          :featured="index === 0 && showHeroLayout"
          :labels="cardLabels"
          :icons="page?.albumIcons ?? { date: '', location: '' }"
          :class="index === 0 && showHeroLayout && 'lg:col-span-2 lg:row-span-2'"
          :style="
            animating ? { viewTransitionName: `album-${albumIndex.get(item.url)}` } : undefined
          "
        />
      </UPageGrid>
    </UContainer>

    <SharedCallToAction />
  </div>
</template>

<style>
  /* Transition de vue des filtres (classe posée sur <html> le temps de la transition) : les albums
     qui restent glissent et se redimensionnent, ceux qui arrivent ou partent s'estompent */
  html.gallery-transition::view-transition-group(*) {
    animation-duration: 300ms;
    animation-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
  }

  html.gallery-transition::view-transition-image-pair(*) {
    overflow: hidden;
    border-radius: var(--radius-2xl);
  }

  /* Fondu croisé plus court que le déplacement : la carte mise en avant qui change de taille ne
     montre pas longtemps son ancien et son nouveau texte superposés */
  html.gallery-transition::view-transition-old(*),
  html.gallery-transition::view-transition-new(*) {
    height: 100%;
    object-fit: cover;
    animation-duration: 180ms;
  }

  html.gallery-transition::view-transition-new(*):only-child {
    animation: album-in 250ms cubic-bezier(0.23, 1, 0.32, 1) both;
  }

  html.gallery-transition::view-transition-old(*):only-child {
    animation: album-out 150ms ease-out both;
  }

  @keyframes album-in {
    from {
      opacity: 0;
      scale: 0.96;
    }
  }

  @keyframes album-out {
    to {
      opacity: 0;
      scale: 0.96;
    }
  }
</style>
