<script setup lang="ts">
const { joinOptions } = useJoinOptions()
const { getSocialIcon, getSocialUrl } = useSocials()
const { buildCdnUrl } = useCdnAsset()
const appConfig = useAppConfig()

const whyJoinFeatures = ref([
  {
    title: 'Activités uniques',
    description: 'Sauts en parachute, soufflerie et formations',
    icon: appConfig.efreipara.icons.rejoindre.whyActivites,
    class: 'text-efreipara-tandem',
  },
  {
    title: 'Communauté passionnée',
    description: 'Rencontre des personnes partageant ta passion',
    icon: appConfig.efreipara.icons.rejoindre.whyCommunaute,
    class: 'text-efreipara-oa',
  },
  {
    title: 'Expériences inoubliables',
    description: 'Crée des souvenirs qui durent toute une vie',
    icon: appConfig.efreipara.icons.rejoindre.whySouvenirs,
    class: 'text-efreipara-soufflerie',
  },
])
</script>

<template>
  <div>
    <UPageHero
      title="Rejoins Efrei Para"
      description="Que tu souhaites simplement participer à nos activités ou t'investir dans l'organisation, il y a une place pour toi !"
      :ui="{ title: 'font-title' }"
    />

    <UContainer class="my-0 py-0">
      <UAlert
        :icon="getSocialIcon('discord')"
        color="neutral"
        variant="subtle"
        title="Prérequis important"
        description="Pour rejoindre le club, tu dois être membre du Discord Efrei Para. C'est notre principal canal de communication pour organiser les événements et partager les informations."
        class="m-0"
        :actions="[
          {
            label: 'Rejoindre le Discord',
            to: getSocialUrl('discord'),
            target: '_blank',
            external: true,
            color: 'neutral',
          },
        ]"
      />
    </UContainer>

    <UContainer>
      <div class="grid md:grid-cols-2 gap-8 py-12">
        <NuxtLink
          v-for="option in joinOptions"
          :key="option.slug"
          :to="option.link"
          target="_blank"
          external
          class="block group"
        >
          <UCard
            :ui="{
              body: 'p-0 sm:p-0',
            }"
            class="h-full transition-all duration-200 hover:shadow-lg"
          >
            <div class="w-full sm:aspect-video overflow-hidden">
              <img
                :src="buildCdnUrl(`${option.slug}.jpg`)"
                :alt="option.title"
                class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <div class="p-6 sm:p-8">
              <div class="flex items-center gap-3 mb-4">
                <UIcon :name="option.icon" class="w-10 h-10 shrink-0" :class="option.color" />
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white" :class="option.color">
                  {{ option.title }}
                </h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                {{ option.description }}
              </p>
              <div
                class="flex items-center gap-2 text-primary-500 dark:text-primary-400 font-semibold"
              >
                <span>{{ option.linkText }}</span>
                <UIcon
                  :name="appConfig.ui.icons.external"
                  class="w-5 h-5 transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </UContainer>

    <UPageSection title="Pourquoi nous rejoindre ?" :features="whyJoinFeatures" />
  </div>
</template>
