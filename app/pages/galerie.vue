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
    <SharedPageHero :title="page?.hero.title" :description="page?.hero.description" />

    <UContainer class="pb-16">
      <div class="mb-8 flex flex-wrap gap-2">
        <UButton
          :color="activeFilter ? 'neutral' : 'primary'"
          :variant="activeFilter ? 'soft' : 'solid'"
          :aria-pressed="!activeFilter"
          class="cursor-pointer rounded-full px-3"
          @click="activeFilter = null"
        >
          {{ page?.hero.allLabel }}
        </UButton>
        <UButton
          v-for="type in activityTypes"
          :key="type"
          :icon="getIcon(type)"
          color="neutral"
          variant="soft"
          :aria-pressed="activeFilter === type"
          class="cursor-pointer rounded-full px-3"
          :class="[
            activityClass(type),
            activeFilter === type && 'bg-activity hover:bg-activity active:bg-activity text-white',
          ]"
          :ui="{ leadingIcon: ['size-4', activeFilter === type ? 'text-white' : 'text-activity'] }"
          @click="activeFilter = activeFilter === type ? null : type"
        >
          {{ getGalleryLabel(type) }}
        </UButton>
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
