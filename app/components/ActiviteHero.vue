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

  const activities = Object.keys(colorClasses) as ActivityType[]
  const currentIndex = activities.indexOf(props.activite)
  const prevActivity = activities[(currentIndex - 1 + activities.length) % activities.length]
  const nextActivity = activities[(currentIndex + 1) % activities.length]

  const [{ data: prevPage }, { data: nextPage }] = await Promise.all([
    useAsyncData(`${prevActivity}-nav`, () =>
      queryCollection('activites').where('stem', '=', `activites/${prevActivity}`).first(),
    ),
    useAsyncData(`${nextActivity}-nav`, () =>
      queryCollection('activites').where('stem', '=', `activites/${nextActivity}`).first(),
    ),
  ])
</script>

<template>
  <div class="relative overflow-hidden">
    <img
      :src="imageUrl"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 h-full w-full mask-[linear-gradient(to_bottom,black_50%,transparent_100%)] object-cover opacity-25 dark:opacity-10"
    />
    <NuxtLink
      :to="`/activites/${prevActivity}`"
      :aria-label="`Aller à ${prevPage?.label}`"
      class="absolute top-2 bottom-0 left-0 z-10 hidden w-18 flex-col items-center justify-center gap-2 rounded-r-lg transition-colors hover:bg-black/5 2xl:flex dark:hover:bg-white/5"
    >
      <UIcon name="tabler:chevron-left" class="size-6 text-gray-400" />
      <span class="text-xs text-gray-400">{{ prevPage?.label }}</span>
    </NuxtLink>
    <NuxtLink
      :to="`/activites/${nextActivity}`"
      :aria-label="`Aller à ${nextPage?.label}`"
      class="absolute top-2 right-0 bottom-0 z-10 hidden w-18 flex-col items-center justify-center gap-2 rounded-l-lg transition-colors hover:bg-black/5 2xl:flex dark:hover:bg-white/5"
    >
      <UIcon name="tabler:chevron-right" class="size-6 text-gray-400" />
      <span class="text-xs text-gray-400">{{ nextPage?.label }}</span>
    </NuxtLink>
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
