<script setup lang="ts">
  const { data: rejoindreData } = await useAsyncData('rejoindre', () =>
    queryCollection('rejoindre').first(),
  )
  const joinOptions = computed(() => rejoindreData.value?.options ?? [])
  const { getSocialIcon, getSocialUrl } = useSocials()
  const { buildCdnUrl } = useCdnAsset()
  const appConfig = useAppConfig()

  // Tailwind scan: bg-efreipara-tandem/10 bg-efreipara-oa/10 bg-efreipara-soufflerie/10 bg-efreipara-pac/10
  const iconBg = (colorClass: string) => colorClass.replace('text-', 'bg-') + '/10'
</script>

<template>
  <div>
    <PageHero :title="rejoindreData?.hero.title" :description="rejoindreData?.hero.description" />

    <UContainer class="pb-16">
      <!-- Bandeau Discord -->
      <div
        class="border-discord/20 bg-discord/10 mb-12 flex flex-col gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center"
      >
        <div class="bg-discord/20 flex size-12 shrink-0 items-center justify-center rounded-xl">
          <UIcon
            :name="getSocialIcon('discord') ?? 'simple-icons:discord'"
            class="text-discord size-6"
          />
        </div>
        <div class="flex-1">
          <p class="mb-0.5 font-bold">{{ rejoindreData?.alert.title }}</p>
          <p class="text-muted text-sm">{{ rejoindreData?.alert.description }}</p>
        </div>
        <UButton
          :to="getSocialUrl('discord')"
          target="_blank"
          external
          :icon="getSocialIcon('discord') ?? 'simple-icons:discord'"
          color="neutral"
          class="shrink-0 rounded-full"
        >
          {{ rejoindreData?.alert.actionLabel }}
        </UButton>
      </div>

      <!-- Devenir membre / Rejoindre le bureau -->
      <div class="grid gap-6 sm:grid-cols-2">
        <NuxtLink
          v-for="option in joinOptions"
          :key="option.slug"
          :to="option.link"
          target="_blank"
          external
          class="group block"
        >
          <UCard
            :ui="{ root: 'rounded-2xl', body: 'p-0 sm:p-0' }"
            class="h-full overflow-hidden transition-shadow duration-200 hover:shadow-lg"
          >
            <div class="aspect-video overflow-hidden">
              <img
                :src="buildCdnUrl(`${option.slug}.jpg`)"
                :alt="option.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div class="flex flex-1 flex-col p-8">
              <div class="mb-4 flex items-center gap-3">
                <div
                  class="flex size-12 shrink-0 items-center justify-center rounded-2xl"
                  :class="iconBg(option.color)"
                >
                  <UIcon :name="option.icon" :class="option.color" class="size-6" />
                </div>
                <h3 class="text-2xl font-bold" :class="option.color">{{ option.title }}</h3>
              </div>
              <p class="text-muted mb-8 flex-1">{{ option.description }}</p>
              <div class="flex items-center gap-1.5 font-semibold" :class="option.color">
                <span>{{ option.linkText }}</span>
                <UIcon
                  :name="appConfig.ui.icons.external"
                  class="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>

      <!-- Pourquoi nous rejoindre ? -->
      <div class="mt-16">
        <h2 class="font-title mb-10 text-center text-3xl font-bold">
          {{ rejoindreData?.why.title }}
        </h2>
        <div class="grid gap-6 sm:grid-cols-3">
          <div
            v-for="feature in rejoindreData?.why.features"
            :key="feature.title"
            class="bg-muted/40 flex flex-col items-center rounded-2xl p-8 text-center"
          >
            <div
              class="mb-5 flex size-14 items-center justify-center rounded-2xl"
              :class="iconBg(feature.class)"
            >
              <UIcon :name="feature.icon" :class="feature.class" class="size-7" />
            </div>
            <h3 class="mb-2 font-bold">{{ feature.title }}</h3>
            <p class="text-muted text-sm">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
