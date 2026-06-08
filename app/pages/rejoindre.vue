<script setup lang="ts">
  const { data: rejoindreData } = await useAsyncData('rejoindre', () =>
    queryCollection('rejoindre').first(),
  )
  const joinOptions = computed(() => rejoindreData.value?.options ?? [])
  const { getSocialIcon, getSocialUrl } = useSocials()
  const { buildCdnUrl } = useCdnAsset()
  const appConfig = useAppConfig()
</script>

<template>
  <div>
    <PageHero :title="rejoindreData?.hero.title" :description="rejoindreData?.hero.description" />

    <UContainer class="my-0 py-0">
      <UAlert
        :icon="getSocialIcon('discord')"
        color="neutral"
        variant="subtle"
        :title="rejoindreData?.alert.title"
        :description="rejoindreData?.alert.description"
        class="m-0"
        :actions="[
          {
            label: rejoindreData?.alert.actionLabel,
            to: getSocialUrl('discord'),
            target: '_blank',
            external: true,
            color: 'neutral',
            class: 'rounded-full',
          },
        ]"
      />
    </UContainer>

    <UContainer>
      <div class="grid gap-8 py-12 md:grid-cols-2">
        <NuxtLink
          v-for="option in joinOptions"
          :key="option.slug"
          :to="option.link"
          target="_blank"
          external
          class="group block"
        >
          <UCard
            :ui="{
              body: 'p-0 sm:p-0',
            }"
            class="h-full transition-all duration-200 hover:shadow-lg"
          >
            <div class="w-full overflow-hidden sm:aspect-video">
              <img
                :src="buildCdnUrl(`${option.slug}.jpg`)"
                :alt="option.title"
                class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <div class="p-6 sm:p-8">
              <div class="mb-4 flex items-center gap-3">
                <UIcon :name="option.icon" class="h-10 w-10 shrink-0" :class="option.color" />
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white" :class="option.color">
                  {{ option.title }}
                </h3>
              </div>
              <p class="mb-6 text-gray-600 dark:text-gray-300">
                {{ option.description }}
              </p>
              <div
                class="text-primary-500 dark:text-primary-400 flex items-center gap-2 font-semibold"
              >
                <span>{{ option.linkText }}</span>
                <UIcon
                  :name="appConfig.ui.icons.external"
                  class="h-5 w-5 transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </UContainer>

    <UPageSection :title="rejoindreData?.why.title" :features="rejoindreData?.why.features" />
  </div>
</template>
