<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'

  const props = defineProps<{
    activite: ActivityType
    title: string
    description: string
    label: string
    alt: string
  }>()

  const { getIcon } = useEventIcon()
  const { buildCdnUrl } = useCdnAsset()

  const icon = getIcon(props.activite)
  const imageUrl = buildCdnUrl(`${props.activite}.jpg`)

  const colorClasses: Record<ActivityType, string> = {
    oa: 'text-efreipara-oa',
    tandem: 'text-efreipara-tandem',
    soufflerie: 'text-efreipara-soufflerie',
    pac: 'text-efreipara-pac',
  }
  const colorClass = colorClasses[props.activite]
</script>

<template>
  <div class="relative overflow-hidden">
    <img
      :src="imageUrl"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 h-full w-full mask-[linear-gradient(to_bottom,black_50%,transparent_100%)] object-cover opacity-25 dark:opacity-10"
    />
    <UContainer class="relative">
      <UPageHero orientation="horizontal" :ui="{ title: 'font-title' }">
        <template #headline>
          <div
            :class="[colorClass, 'hero-slide-up flex items-center font-semibold']"
            style="animation-delay: 0.4s"
          >
            <UIcon :name="icon" class="mr-2 size-4" />
            {{ label }}
          </div>
        </template>
        <template #title>
          <span class="hero-slide-up inline-block" style="animation-delay: 0.1s">{{ title }}</span>
        </template>
        <template #description>
          <span class="hero-slide-up inline-block" style="animation-delay: 0.25s">
            {{ description }}
          </span>
        </template>
        <img :src="imageUrl" :alt="alt" class="w-full rounded-lg" />
      </UPageHero>
      <slot />
    </UContainer>
  </div>
</template>
