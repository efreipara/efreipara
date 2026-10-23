<script setup lang="ts">
  const { data: rejoindreData } = await useAsyncData('rejoindre', () =>
    queryCollection('rejoindre').first(),
  )
  const joinOptions = computed(() => rejoindreData.value?.options ?? [])
  const { getSocialIcon, getSocialUrl } = useSocials()
  const { buildCdnUrl } = useCdnAsset()
  const appConfig = useAppConfig()

  const activityOf = (colorClass: string) => colorClass.replace('text-efreipara-', '')
</script>

<template>
  <div>
    <SharedPageHero
      :title="rejoindreData?.hero.title"
      :description="rejoindreData?.hero.description"
    />

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
        <UPageCard
          v-for="option in joinOptions"
          :key="option.slug"
          :to="option.link"
          target="_blank"
          :title="option.title"
          class="group"
          :class="activityClass(activityOf(option.color))"
          :ui="{
            root: 'hover:bg-default overflow-hidden rounded-2xl duration-200 hover:shadow-lg',
            container: 'gap-0 p-0 sm:p-0 lg:flex',
            wrapper: 'items-stretch',
            header: 'mb-0 aspect-video overflow-hidden',
            body: 'flex flex-col p-8',
          }"
        >
          <template #header>
            <img
              :src="buildCdnUrl(`${option.slug}.jpg`)"
              :alt="option.title"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </template>
          <template #body>
            <div class="mb-4 flex items-center gap-3">
              <div class="bg-tint-10 flex size-12 shrink-0 items-center justify-center rounded-2xl">
                <UIcon :name="option.icon" class="text-activity size-6" />
              </div>
              <h3 class="text-activity text-2xl font-extrabold">
                {{ option.title }}
              </h3>
            </div>
            <p class="text-muted mb-8 flex-1">{{ option.description }}</p>
            <div class="text-activity flex items-center gap-1.5 font-semibold">
              <span>{{ option.linkText }}</span>
              <UIcon
                :name="appConfig.ui.icons.external"
                class="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </div>
          </template>
        </UPageCard>
      </div>

      <!-- Pourquoi nous rejoindre ? -->
      <div class="mt-16">
        <h2 class="font-title mb-10 text-center text-3xl font-bold">
          {{ rejoindreData?.why.title }}
        </h2>
        <div class="grid gap-6 sm:grid-cols-3">
          <UCard
            v-for="feature in rejoindreData?.why.features"
            :key="feature.title"
            variant="soft"
            class="bg-muted/40 rounded-2xl"
            :ui="{ body: 'flex flex-col items-center p-8 text-center sm:p-8' }"
            :class="activityClass(activityOf(feature.class))"
          >
            <div class="bg-tint-10 mb-5 flex size-14 items-center justify-center rounded-2xl">
              <UIcon :name="feature.icon" class="text-activity size-7" />
            </div>
            <h3 class="mb-2 font-bold">{{ feature.title }}</h3>
            <p class="text-muted text-sm">{{ feature.description }}</p>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>
