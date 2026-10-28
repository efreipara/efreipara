<script setup lang="ts">
  import type { GalleryItem } from '~/utils/gallery'

  const props = defineProps<{
    item: GalleryItem
    /** Carte mise en avant (2 × 2 en lg dans la galerie) */
    featured?: boolean
    labels: { link: string; linkSource: string }
    icons: { date: string; location: string }
    /** Niveau du titre : h2 quand aucun titre de section ne précède les cartes */
    heading?: 'h2' | 'h3'
  }>()

  const { getIcon, getGalleryLabel } = await useActivities()
  const { buildCdnUrl } = useCdnAsset()
  const appConfig = useAppConfig()

  // Chargée ou définitivement en échec : le squelette disparaît
  const settled = ref(false)

  // Couvertures d'Efrei Picture Studio (`photo`) bloquées par leur en-tête
  // Cross-Origin-Resource-Policy: same-origin : photo du CDN (<type>/<date>.jpg) seule.
  // S'ils l'ouvrent (cross-origin), rétablir ce bloc à la place des deux lignes suivantes.
  // const failed = ref(false)
  // const fallback = computed(() => buildCdnUrl(galleryFallbackPath(props.item)))
  // const src = computed(() =>
  //   props.item.photo && !failed.value ? props.item.photo : fallback.value || props.item.photo,
  // )
  // const onError = () => {
  //   if (props.item.photo && !failed.value) {
  //     failed.value = true
  //     if (fallback.value) return
  //   }
  //   settled.value = true
  // }
  const src = computed(() => buildCdnUrl(galleryFallbackPath(props.item)))
  const onError = () => (settled.value = true)

  // Un chargement ou une erreur survenus avant l'hydratation ne sont pas captés par @load/@error
  const checkPhoto = (el: unknown) => {
    if (!(el instanceof HTMLImageElement) || !el.complete || settled.value) return
    if (el.naturalWidth > 0) settled.value = true
    else onError()
  }

  const date = computed(() =>
    new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(
      new Date(props.item.date),
    ),
  )
</script>

<template>
  <NuxtLink
    :to="item.url"
    target="_blank"
    external
    class="group relative block overflow-hidden rounded-2xl transition-transform duration-150 ease-out active:scale-[0.98]"
  >
    <div
      class="relative aspect-3/2 w-full overflow-hidden"
      :class="featured && 'lg:aspect-[unset] lg:h-full'"
    >
      <USkeleton v-if="!settled" class="absolute inset-0 rounded-none" />
      <img
        :ref="checkPhoto"
        :src="src"
        alt=""
        :loading="featured ? 'eager' : 'lazy'"
        :fetchpriority="featured ? 'high' : undefined"
        class="h-full w-full object-cover transition-[opacity,scale] duration-500 group-hover:scale-105"
        :class="settled ? 'opacity-100' : 'opacity-0'"
        @load="settled = true"
        @error="onError"
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
        {{ getGalleryLabel(item.type) }}
      </div>
    </div>
    <div
      class="absolute right-0 bottom-0 left-0 p-4 text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]"
    >
      <component
        :is="heading ?? 'h3'"
        class="font-title mb-1.5 leading-tight font-bold"
        :class="featured ? 'lg:text-xl' : 'text-base'"
      >
        {{ item.title }}
      </component>
      <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-white/70">
        <span class="flex items-center gap-1">
          <UIcon :name="icons.date" class="size-3" />
          {{ date }}
        </span>
        <span class="flex items-center gap-1">
          <UIcon :name="icons.location" class="size-3" />
          {{ item.location }}
        </span>
      </div>
      <div class="mt-2 flex items-center gap-1 text-xs font-semibold text-white/90">
        {{ item.source ? fillLabel(labels.linkSource, { source: item.source }) : labels.link }}
        <UIcon
          :name="appConfig.ui.icons.external"
          class="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </div>
    </div>
  </NuxtLink>
</template>
