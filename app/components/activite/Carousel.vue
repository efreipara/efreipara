<script setup lang="ts">
  import type { ActivityType } from '~/utils/activities'

  const props = defineProps<{
    activite: ActivityType
    label: string
    imageCount: number
    band?: boolean
  }>()

  const { buildCdnUrl } = useCdnAsset()
  const { labels } = await useLabels()

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
  <div v-if="images.length" :class="band && 'bg-elevated/60'">
    <UContainer class="py-12 sm:py-16">
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
          prev: 'rounded-md sm:inset-s-4',
          next: 'rounded-md sm:inset-e-4',
        }"
      >
        <img
          :src="item.url"
          :alt="fillLabel(labels.activity.photo, { label, n: item.index })"
          width="500"
          height="400"
          class="aspect-5/4 w-full rounded-lg object-cover"
          @error="onError(item.url)"
        />
      </UCarousel>
    </UContainer>
  </div>
</template>
