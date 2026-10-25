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
          @click="activeFilter = null"
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
          @click="activeFilter = activeFilter === type ? null : type"
        />
      </div>

      <!-- Grille photo : fondu d'entrée au changement de filtre ; l'ancienne grille disparaît aussitôt -->
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        leave-active-class="hidden"
      >
        <div
          :key="activeFilter ?? 'tous'"
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <!-- Premier élément : 2 colonnes × 2 lignes sur lg quand la mise en avant s'applique -->
          <SharedAlbumCard
            v-for="(item, index) in filteredItems"
            :key="item.url"
            :item="item"
            :featured="index === 0 && showHeroLayout"
            :labels="cardLabels"
            :icons="page?.albumIcons ?? { date: '', location: '' }"
            :class="index === 0 && showHeroLayout && 'lg:col-span-2 lg:row-span-2'"
          />
        </div>
      </Transition>
    </UContainer>

    <SharedCallToAction />
  </div>
</template>
