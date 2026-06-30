<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'

  const { getIcon } = useEventIcon()
  const { buildCdnUrl } = useCdnAsset()
  const appConfig = useAppConfig()

  const { data: page } = await useAsyncData('activites-index', () =>
    queryCollection('activitesIndex').first(),
  )

  const activityCssVar: Record<ActivityType, string> = {
    oa: 'var(--color-efreipara-oa)',
    tandem: 'var(--color-efreipara-tandem)',
    soufflerie: 'var(--color-efreipara-soufflerie)',
    pac: 'var(--color-efreipara-pac)',
  }

  const activityIconStyle = (type: string) => ({
    color: activityCssVar[type as ActivityType],
  })
  const activityBgStyle = (type: string) => ({
    backgroundColor: `color-mix(in oklch, ${activityCssVar[type as ActivityType]} 10%, transparent)`,
  })
</script>

<template>
  <div>
    <SharedPageHero :title="page?.hero.title" :description="page?.hero.description" />

    <div
      v-for="(section, i) in page?.sections"
      :key="section.type"
      :class="i % 2 !== 0 ? 'border-default border-y' : ''"
    >
      <UContainer class="py-20">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div :class="i % 2 !== 0 ? 'lg:order-2' : ''">
            <img
              :src="buildCdnUrl(`${section.type}.jpg`)"
              :alt="section.alt"
              class="aspect-4/3 w-full rounded-2xl object-cover"
            />
          </div>
          <div :class="i % 2 !== 0 ? 'lg:order-1' : ''">
            <div class="mb-4 flex items-center gap-3">
              <div
                class="flex size-14 shrink-0 items-center justify-center rounded-2xl"
                :style="activityBgStyle(section.type)"
              >
                <UIcon
                  :name="getIcon(section.type as ActivityType)"
                  :style="activityIconStyle(section.type)"
                  class="size-7"
                />
              </div>
              <h2 class="font-title text-3xl font-bold">{{ section.title }}</h2>
            </div>
            <p class="text-muted mb-8">{{ section.description }}</p>
            <div class="mb-8 grid gap-5 sm:grid-cols-2">
              <div
                v-for="feature in section.features"
                :key="feature.title"
                class="flex items-start gap-3"
              >
                <div
                  class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl"
                  :style="activityBgStyle(section.type)"
                >
                  <UIcon
                    :name="feature.icon"
                    :style="activityIconStyle(section.type)"
                    class="size-4"
                  />
                </div>
                <div>
                  <p class="text-sm font-semibold">{{ feature.title }}</p>
                  <p class="text-muted text-sm">{{ feature.description }}</p>
                </div>
              </div>
            </div>
            <UButton
              :to="`/activites/${section.type}`"
              color="neutral"
              variant="subtle"
              size="lg"
              :trailing-icon="appConfig.ui.icons.arrowRight"
              class="rounded-full"
            >
              {{ section.link.label }}
            </UButton>
          </div>
        </div>
      </UContainer>
    </div>

    <SharedCallToAction />
  </div>
</template>
