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

    <UPageSection title="Pourquoi nous rejoindre ?" :features="whyJoinFeatures" />
  </div>
</template>
