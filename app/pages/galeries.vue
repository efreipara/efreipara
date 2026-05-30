<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'

  const { getIcon } = useEventIcon()
  const appConfig = useAppConfig()

  const galeries = ref([
    {
      title: 'Baptême Soufflerie',
      type: 'soufflerie' as ActivityType,
      url: 'https://efreipicturestudio.fr/gallery/bapteme-soufflerie-2026',
      photo:
        'https://efreipicturestudio.fr/gallery/content/s/6a06f64f8b68cf06b56f4f41/200ff7d24d0?a=a',
      date: '6 mars 2026',
      location: 'iFly Paris - La Villette',
    },
    {
      title: 'Sauts en Tandem',
      type: 'tandem' as ActivityType,
      url: 'https://efreipicturestudio.fr/gallery/sauts-en-tandem--2025',
      photo:
        'https://efreipicturestudio.fr/gallery/content/s/68584dac8b68cf06b56ece44/381ae29f43f?a=a',
      date: '18 mai 2025',
      location: 'Skydive Event Paris - Péronne',
    },
    {
      title: 'Baptême Soufflerie',
      type: 'soufflerie' as ActivityType,
      url: 'https://efreipicturestudio.fr/gallery/bapteme-soufflerie-2025-2025',
      photo:
        'https://efreipicturestudio.fr/gallery/content/s/67c629a48b68cf06b56e8d89/63e663b83d?a=a',
      date: '7 février 2025',
      location: 'iFly Paris - La Villette',
    },
    {
      title: 'Baptême Soufflerie',
      type: 'soufflerie' as ActivityType,
      url: 'https://efreipicturestudio.fr/gallery/bapteme-soufflerie-2025',
      photo:
        'https://efreipicturestudio.fr/gallery/content/s/679556298b68cf06b56e82c1/79e03687a3?a=a',
      date: '6 décembre 2024',
      location: 'iFly Paris - La Villette',
    },
    {
      title: 'Sauts en Tandem',
      type: 'tandem' as ActivityType,
      url: 'https://efreipicturestudio.fr/gallery/saut-en-tandem-2024',
      photo:
        'https://efreipicturestudio.fr/gallery/content/s/66dcac828b68cf06b56e63e1/13263d2c21f?a=a',
      date: '1er septembre 2024',
      location: 'Skydive Event Paris - Péronne',
    },
    {
      title: 'Baptême Soufflerie',
      type: 'soufflerie' as ActivityType,
      url: 'https://efreipicturestudio.fr/gallery/bapteme-soufflerie-2024',
      photo:
        'https://efreipicturestudio.fr/gallery/content/s/65ce870c8b68cf06b56e32a4/20a3f8078a?a=a',
      date: '26 janvier 2024',
      location: 'iFly Paris - La Villette',
    },
    {
      title: 'Baptême Soufflerie',
      type: 'soufflerie' as ActivityType,
      url: 'https://efreipicturestudio.fr/gallery/bapteme-soufflerie--efrei-para-2023',
      photo:
        'https://efreipicturestudio.fr/gallery/content/s/648f5ead8b68cf06b56dfc71/165e52261a?a=a',
      date: '19 mai 2023',
      location: 'iFly Paris - La Villette',
    },
  ])
</script>

<template>
  <div>
    <UPageHero
      title="Galeries Photos"
      description="Revivez nos événements en images grâce aux galeries de l'association photo Efrei Picture Studio"
      :icon="appConfig.efreipara.icons.navigation.galeries"
      :ui="{ title: 'font-title' }"
    />

    <UPageSection :ui="{ container: 'pt-0!' }">
      <UPageGrid>
        <NuxtLink
          v-for="galerie in galeries"
          :key="galerie.title"
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
                <UIcon :name="getIcon(galerie.type)" class="text-primary h-6 w-6 shrink-0" />
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
                <span>Voir la galerie</span>
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
