<script setup lang="ts">
  const { getIcon, byKey } = await useActivities()
  const { buildCdnUrl } = useCdnAsset()
  const appConfig = useAppConfig()

  const { data: page } = await useAsyncData('galerie', () => queryCollection('galerie').first())

  const activeFilter = ref<string | null>(null)

  const activityTypes = computed(() => galleryTypes(page.value?.items ?? []))

  const filteredItems = computed(() => filterGallery(page.value?.items ?? [], activeFilter.value))

  const showHeroLayout = computed(() =>
    hasGalleryHeroLayout(activeFilter.value, filteredItems.value.length),
  )

  // `photo` en priorité ; repli sur le CDN (<type>/<date>.jpg) si absente ou en erreur
  const failedPhotos = ref(new Set<string>())
  // Chargées ou définitivement en échec : le squelette disparaît
  const settledPhotos = ref(new Set<string>())

  const photoSrc = (item: { url: string; type: string; date: string; photo?: string }) => {
    if (item.photo && !failedPhotos.value.has(item.url)) return item.photo
    return buildCdnUrl(galleryFallbackPath(item)) || item.photo
  }

  const onPhotoLoad = (item: { url: string }) => {
    settledPhotos.value.add(item.url)
  }

  const onPhotoError = (item: { url: string; type: string; date: string; photo?: string }) => {
    if (item.photo && !failedPhotos.value.has(item.url)) {
      failedPhotos.value.add(item.url)
      if (buildCdnUrl(galleryFallbackPath(item))) return
    }
    settledPhotos.value.add(item.url)
  }

  // Un chargement ou une erreur survenus avant l'hydratation ne sont pas captés par @load/@error
  const checkPhoto = (
    el: unknown,
    item: { url: string; type: string; date: string; photo?: string },
  ) => {
    if (!(el instanceof HTMLImageElement) || !el.complete || settledPhotos.value.has(item.url))
      return
    if (el.naturalWidth > 0) onPhotoLoad(item)
    else onPhotoError(item)
  }

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(
      new Date(iso),
    )

  const typeLabel = (type: string) => {
    const activity = byKey(type)
    return activity?.galleryLabel ?? activity?.label ?? type
  }
</script>

<template>
  <div>
    <SharedPageHero :title="page?.hero.title" :description="page?.hero.description" />

    <UContainer class="pb-16">
      <!-- Filtres par type d'activité -->
      <div class="mb-8 flex flex-wrap gap-2">
        <UButton
          :color="activeFilter ? 'neutral' : 'primary'"
          :variant="activeFilter ? 'soft' : 'solid'"
          :aria-pressed="!activeFilter"
          class="cursor-pointer rounded-full px-3"
          @click="activeFilter = null"
        >
          Tout voir
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
          {{ typeLabel(type) }}
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
          <NuxtLink
            v-for="(item, index) in filteredItems"
            :key="item.url"
            :to="item.url"
            target="_blank"
            external
            class="group relative block overflow-hidden rounded-2xl transition-transform duration-150 ease-out active:scale-[0.98]"
            :class="index === 0 && showHeroLayout && 'lg:col-span-2 lg:row-span-2'"
          >
            <div
              class="relative aspect-3/2 w-full overflow-hidden"
              :class="index === 0 && showHeroLayout && 'lg:aspect-[unset] lg:h-full'"
            >
              <USkeleton
                v-if="!settledPhotos.has(item.url)"
                class="absolute inset-0 rounded-none"
              />
              <img
                :ref="(el) => checkPhoto(el, item)"
                :src="photoSrc(item)"
                :alt="item.title"
                class="h-full w-full object-cover transition-[opacity,scale] duration-500 group-hover:scale-105"
                :class="settledPhotos.has(item.url) ? 'opacity-100' : 'opacity-0'"
                @load="onPhotoLoad(item)"
                @error="onPhotoError(item)"
              />
            </div>
            <div
              class="pointer-events-none absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/10 transition-opacity duration-300 group-hover:opacity-95"
            />
            <div class="absolute top-3 left-3">
              <div
                class="flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
                :class="activityClass(item.type)"
              >
                <UIcon :name="getIcon(item.type)" class="text-activity size-3.5" />
                {{ typeLabel(item.type) }}
              </div>
            </div>
            <div
              class="absolute right-0 bottom-0 left-0 p-4 text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]"
            >
              <h3
                class="font-title mb-1.5 leading-tight font-bold"
                :class="index === 0 && showHeroLayout ? 'lg:text-xl' : 'text-base'"
              >
                {{ item.title }}
              </h3>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-white/70">
                <span class="flex items-center gap-1">
                  <UIcon :name="appConfig.efreipara.icons.extras.calendar" class="size-3" />
                  {{ formatDate(item.date) }}
                </span>
                <span class="flex items-center gap-1">
                  <UIcon :name="appConfig.efreipara.icons.contact.mapPin" class="size-3" />
                  {{ item.location }}
                </span>
              </div>
              <div class="mt-2 flex items-center gap-1 text-xs font-semibold text-white/90">
                {{
                  item.source ? `${page?.hero.linkLabel} sur ${item.source}` : page?.hero.linkLabel
                }}
                <UIcon
                  :name="appConfig.ui.icons.external"
                  class="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </div>
            </div>
          </NuxtLink>
        </div>
      </Transition>
    </UContainer>

    <SharedCallToAction />
  </div>
</template>
