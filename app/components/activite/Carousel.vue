<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'

  const props = defineProps<{
    activite: ActivityType
    imageCount: number
  }>()

  const { buildCdnUrl } = useCdnAsset()

  const failedUrls = ref(new Set<string>())

  const images = computed(() =>
    Array.from({ length: props.imageCount }, (_, i) => ({
      index: i + 1,
      url: buildCdnUrl(`${props.activite}-${i + 1}.jpg`),
    })).filter((img) => !failedUrls.value.has(img.url)),
  )

  const onError = (url: string) => {
    failedUrls.value = new Set([...failedUrls.value, url])
  }
</script>

<template>
  <UContainer v-if="images.length" class="py-12">
    <UCarousel
      v-slot="{ item }"
      :items="images"
      loop
      :autoplay="{ delay: 3000 }"
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
