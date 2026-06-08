<script setup lang="ts">
  defineProps<{
    title: string
    description?: string
  }>()

  const { buildCdnUrl } = useCdnAsset()

  const imageUrl = buildCdnUrl('page-hero.jpg')
</script>

<template>
  <div class="relative overflow-hidden">
    <img
      :src="imageUrl"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 h-full w-full mask-[linear-gradient(to_bottom,black_50%,transparent_100%)] object-cover opacity-25 dark:opacity-10"
    />
    <UContainer class="relative">
      <UPageHero :ui="{ title: 'font-title' }">
        <template #title>
          <span class="hero-slide-up inline-block" style="animation-delay: 0.1s">{{ title }}</span>
        </template>
        <template v-if="description" #description>
          <span class="hero-slide-up inline-block" style="animation-delay: 0.25s">
            {{ description }}
          </span>
        </template>
      </UPageHero>
    </UContainer>
  </div>
</template>
