<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'

  const { getIcon } = useEventIcon()
  const appConfig = useAppConfig()

  const { data: page } = await useAsyncData('galeries', () => queryCollection('galeries').first())
</script>

<template>
  <div>
    <PageHero :title="page?.hero.title" :description="page?.hero.description" />

    <UPageSection :ui="{ container: 'pt-0!' }">
      <UPageGrid>
        <NuxtLink
          v-for="galerie in page?.items"
          :key="galerie.url"
          :to="galerie.url"
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
            <div class="aspect-3/2 w-full overflow-hidden">
              <img
                :src="galerie.photo"
                :alt="galerie.title"
                class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <div class="p-6 sm:p-8">
              <!-- Titre avec icône -->
              <div class="mb-3 flex items-center gap-2">
                <UIcon
                  :name="getIcon(galerie.type as ActivityType)"
                  class="text-primary h-6 w-6 shrink-0"
                />
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ galerie.title }}
                </h3>
              </div>

              <!-- Date et Type -->
              <div class="mb-3 space-y-1.5 text-sm">
                <div class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <UIcon :name="appConfig.efreipara.icons.extras.calendar" class="size-4" />
                  <span>{{ galerie.date }}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <UIcon :name="appConfig.efreipara.icons.contact.mapPin" class="size-4" />
                  <span>{{ galerie.location }}</span>
                </div>
              </div>

              <!-- Lien -->
              <div
                class="text-primary-500 dark:text-primary-400 flex items-center gap-2 text-sm font-semibold"
              >
                <span>{{ page?.hero.linkLabel }}</span>
                <UIcon
                  :name="appConfig.ui.icons.external"
                  class="h-4 w-4 transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </UPageGrid>
    </UPageSection>
    <CallToAction />
  </div>
</template>
