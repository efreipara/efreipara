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

  const { prev: prevActivity, next: nextActivity } = adjacentActivities(props.activite)

  const [{ data: prevPage }, { data: nextPage }] = await Promise.all([
    useAsyncData(`${prevActivity}-nav`, () =>
      queryCollection('activites').where('stem', '=', `pages/activites/${prevActivity}`).first(),
    ),
    useAsyncData(`${nextActivity}-nav`, () =>
      queryCollection('activites').where('stem', '=', `pages/activites/${nextActivity}`).first(),
    ),
  ])
</script>

<template>
  <div class="relative overflow-hidden" :class="activityClass(activite)">
    <img
      :src="imageUrl"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 h-full w-full mask-[linear-gradient(to_bottom,black_50%,transparent_100%)] object-cover opacity-20 blur-sm dark:opacity-15"
    />

    <NuxtLink
      :to="`/activites/${prevActivity}`"
      :aria-label="`Aller à ${prevPage?.label}`"
      class="absolute top-2 bottom-0 left-0 z-10 hidden w-18 flex-col items-center justify-center gap-2 rounded-r-lg transition-colors hover:bg-black/5 2xl:flex dark:hover:bg-white/5"
    >
      <UIcon name="tabler:chevron-left" class="text-dimmed size-6" />
      <span class="text-dimmed text-xs">{{ prevPage?.label }}</span>
    </NuxtLink>
    <NuxtLink
      :to="`/activites/${nextActivity}`"
      :aria-label="`Aller à ${nextPage?.label}`"
      class="absolute top-2 right-0 bottom-0 z-10 hidden w-18 flex-col items-center justify-center gap-2 rounded-l-lg transition-colors hover:bg-black/5 2xl:flex dark:hover:bg-white/5"
    >
      <UIcon name="tabler:chevron-right" class="text-dimmed size-6" />
      <span class="text-dimmed text-xs">{{ nextPage?.label }}</span>
    </NuxtLink>

    <UContainer class="relative">
      <UPageHero orientation="horizontal" :ui="{ title: 'font-title' }">
        <template #headline>
          <div
            class="hero-slide-up bg-tint-12 text-activity inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold"
            style="animation-delay: 0.4s"
          >
            <UIcon :name="icon" class="size-3.5" />
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
        <img :src="imageUrl" :alt="alt" class="w-full rounded-2xl" />
      </UPageHero>
    </UContainer>
  </div>
</template>
