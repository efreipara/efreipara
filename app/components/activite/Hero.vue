<script setup lang="ts">
  import type { ActivityType } from '~/utils/activities'

  const props = defineProps<{
    activite: ActivityType
    title: string
    description: string
    label: string
    alt: string
  }>()

  const { getIcon, byKey, activityPath } = await useActivities()
  const { buildCdnUrl, cdnImage } = useCdnAsset()
  const { labels } = await useLabels()
  const appConfig = useAppConfig()

  const icon = getIcon(props.activite)
  const image = cdnImage(`activites/${props.activite}`, 'half')
  // Fond flouté à 20 % d'opacité : la plus petite largeur suffit
  const backgroundUrl = buildCdnUrl(cdnImagePath(`activites/${props.activite}`, 480))

  const { prev: prevActivity, next: nextActivity } = adjacentActivities(props.activite)

  const prevPage = computed(() => byKey(prevActivity))
  const nextPage = computed(() => byKey(nextActivity))
</script>

<template>
  <div class="relative overflow-hidden" :class="activityClass(activite)">
    <img
      :src="backgroundUrl"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 h-full w-full mask-[linear-gradient(to_bottom,black_50%,transparent_100%)] object-cover opacity-20 blur-sm dark:opacity-15"
    />

    <NuxtLink
      :to="activityPath(prevActivity)"
      :aria-label="fillLabel(labels.activity.goTo, { label: prevPage?.label ?? '' })"
      class="absolute top-2 bottom-0 left-0 z-10 hidden w-18 flex-col items-center justify-center gap-2 rounded-r-lg transition-colors hover:bg-black/5 2xl:flex dark:hover:bg-white/5"
    >
      <UIcon :name="appConfig.ui.icons.chevronLeft" class="text-dimmed size-6" />
      <span class="text-dimmed text-xs">{{ prevPage?.label }}</span>
    </NuxtLink>
    <NuxtLink
      :to="activityPath(nextActivity)"
      :aria-label="fillLabel(labels.activity.goTo, { label: nextPage?.label ?? '' })"
      class="absolute top-2 right-0 bottom-0 z-10 hidden w-18 flex-col items-center justify-center gap-2 rounded-l-lg transition-colors hover:bg-black/5 2xl:flex dark:hover:bg-white/5"
    >
      <UIcon :name="appConfig.ui.icons.chevronRight" class="text-dimmed size-6" />
      <span class="text-dimmed text-xs">{{ nextPage?.label }}</span>
    </NuxtLink>

    <UContainer class="relative">
      <UPageHero orientation="horizontal" :ui="{ title: 'font-title' }">
        <template #headline>
          <div
            class="hero-slide-up bg-tint-12 text-activity-strong inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold"
            style="animation-delay: 0.2s"
          >
            <UIcon :name="icon" class="size-3.5" />
            {{ label }}
          </div>
        </template>
        <template #title>
          <span class="hero-slide-up title-ink inline-block" style="animation-delay: 0.05s">
            {{ title }}
          </span>
        </template>
        <template #description>
          <span class="hero-slide-up inline-block" style="animation-delay: 0.12s">
            {{ description }}
          </span>
        </template>
        <img
          v-bind="image"
          :alt="alt"
          fetchpriority="high"
          class="aspect-square w-full rounded-2xl object-cover"
        />
      </UPageHero>
    </UContainer>
  </div>
</template>
