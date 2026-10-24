<script setup lang="ts">
  import type { ActivityType } from '~/utils/activities'

  const props = defineProps<{
    activite: ActivityType
    imageCount: number
  }>()

  const { buildCdnUrl } = useCdnAsset()

  const failedUrls = ref(new Set<string>())

  const images = computed(() =>
    Array.from({ length: props.imageCount }, (_, i) => ({
      index: i + 1,
      url: buildCdnUrl(`${props.activite}/${props.activite}-${i + 1}.jpg`),
    })).filter((img) => !failedUrls.value.has(img.url)),
  )

  const onError = (url: string) => {
    failedUrls.value = new Set([...failedUrls.value, url])
  }

  // Pas de défilement automatique avec « réduire les animations » ; pause au survol sinon.
  // Activé seulement au montage : UCarousel charge le plugin en asynchrone et un chargement
  // lancé puis annulé (true puis false) peut l'emporter sur le second.
  const autoplay = ref<false | { delay: number; stopOnMouseEnter: boolean }>(false)
  onMounted(() => {
    if (!prefersReducedMotion()) autoplay.value = { delay: 3000, stopOnMouseEnter: true }
  })
</script>

<template>
  <UContainer v-if="images.length" class="py-12">
    <UCarousel
      v-slot="{ item }"
      :items="images"
      loop
      :autoplay="autoplay"
      dots
      wheel-gestures
      :prev="{ variant: 'solid' }"
      :next="{ variant: 'solid' }"
      :ui="{
        item: 'basis-full sm:basis-1/2 lg:basis-1/3 pe-3',
        container: 'ms-0',
        prev: 'sm:inset-s-4',
        next: 'sm:inset-e-4',
      }"
    >
      <img
        :src="item.url"
        :alt="`Photo ${activite} ${item.index}`"
        width="400"
        height="500"
        class="aspect-5/4 w-full rounded-lg object-cover"
        @error="onError(item.url)"
      />
    </UCarousel>
  </UContainer>
</template>
