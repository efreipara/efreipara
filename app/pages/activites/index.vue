<script setup lang="ts">
  import type { ButtonProps } from '@nuxt/ui'
  import type { ActivityType } from '~/composables/useActivities'

  const { getIcon } = useEventIcon()
  const { getColor } = useActivityColor()
  const { buildCdnUrl } = useCdnAsset()
  const appConfig = useAppConfig()

  const isLargeScreen = ref(false)

  onMounted(() => {
    const checkScreenSize = () => {
      isLargeScreen.value = window.innerWidth >= 1024
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    onUnmounted(() => window.removeEventListener('resize', checkScreenSize))
  })

  const { data: page } = await useAsyncData('activites-index', () =>
    queryCollection('activitesIndex').first(),
  )

  const buildLinks = (link: { label: string; to: string }): ButtonProps[] => [
    {
      label: link.label,
      to: link.to,
      color: 'neutral',
      variant: 'subtle',
      trailingIcon: appConfig.ui.icons.arrowRight,
      class: 'rounded-full',
    },
  ]

  const buildFeatures = (section: {
    type: string
    features: { title: string; description: string; icon: string }[]
  }) =>
    section.features.map((f) => ({
      ...f,
      class: `text-${getColor(section.type as ActivityType)}`,
    }))
</script>

<template>
  <div>
    <UPageHero
      :title="page?.hero.title"
      :description="page?.hero.description"
      :ui="{ title: 'font-title' }"
    />
    <UPageSection
      v-for="(section, i) in page?.sections"
      :key="section.type"
      :title="section.title"
      :description="section.description"
      orientation="horizontal"
      :icon="getIcon(section.type as ActivityType)"
      :features="buildFeatures(section)"
      :links="buildLinks(section.link)"
      :reverse="isLargeScreen && i % 2 !== 0"
      :ui="{
        title: 'font-title',
        leadingIcon: `text-${getColor(section.type as ActivityType)} size-10 shrink-0`,
        container: i === 0 ? 'pt-0!' : '',
      }"
    >
      <img
        :src="buildCdnUrl(`${section.type}.jpg`)"
        :alt="section.alt"
        class="w-full rounded-lg"
      />
    </UPageSection>
    <CallToAction />
  </div>
</template>
