<script setup lang="ts">
  import type { ButtonProps } from '@nuxt/ui'
  import DOMPurify from 'isomorphic-dompurify'

  const { getIcon } = useEventIcon()
  const { getColor } = useActivityColor()
  const { partners } = usePartners()
  const appConfig = useAppConfig()

  const { data: home } = await useAsyncData('home', () => queryCollection('home').first())

  const activitesFeatures = computed(
    () =>
      home.value?.activites.items.map((item) => ({
        title: item.title,
        description: item.description,
        icon: getIcon(item.type as ActivityType),
        to: item.to,
        class: `text-${getColor(item.type as ActivityType)}`,
      })) ?? [],
  )

  const activitesLink = computed<ButtonProps[]>(() => [
    {
      label: home.value?.activites.link.label ?? '',
      to: home.value?.activites.link.to ?? '/activites',
      color: 'neutral',
      variant: 'subtle',
      trailingIcon: appConfig.ui.icons.arrowRight,
      class: 'rounded-full',
    },
  ])

  const whyFeatures = computed(
    () =>
      home.value?.why.map((item) => ({
        title: item.title,
        description: item.description,
        icon: item.icon,
        class: `text-${getColor(item.type as ActivityType)}`,
      })) ?? [],
  )
</script>

<template>
  <div>
    <MainHero />

    <UPageSection
      :title="home?.sections.about"
      icon="efreipara:parachute"
      :ui="{ container: 'py-12!', title: 'font-title' }"
    >
      <div class="flex items-center gap-8">
        <div class="text-muted flex flex-col gap-4">
          <p
            v-for="paragraph in home?.about.paragraphs"
            :key="paragraph"
            v-html="DOMPurify.sanitize(paragraph)"
          />
        </div>
        <img
          src="~/assets/images/avion.svg"
          alt=""
          aria-hidden="true"
          class="hidden h-auto w-72 shrink-0 opacity-90 md:block dark:opacity-75"
        />
      </div>
    </UPageSection>

    <div class="border-default border-y">
      <UContainer>
        <div class="divide-default grid grid-cols-3 divide-x">
          <div
            v-for="stat in home?.stats"
            :key="stat.description"
            class="flex flex-col items-center gap-1 py-10"
          >
            <UIcon :name="stat.icon" class="text-muted mb-1 size-5" />
            <StatCounter
              :value="stat.title"
              class="font-title text-4xl font-bold tracking-tight md:text-5xl"
            />
            <span class="text-muted px-2 text-center text-xs sm:text-sm">
              {{ stat.description }}
            </span>
          </div>
        </div>
      </UContainer>
    </div>

    <UPageSection
      :title="home?.sections.activites"
      :features="activitesFeatures"
      :links="activitesLink"
      :ui="{
        features: 'sm:grid-cols-2 lg:grid-cols-2 gap-8 grid',
        title: 'font-title',
      }"
    />

    <UPageSection
      :title="home?.sections.why"
      :features="whyFeatures"
      :ui="{ title: 'font-title' }"
    />

    <div class="border-default border-t">
      <UContainer class="py-12">
        <p class="font-title mb-8 text-center text-2xl">{{ home?.sections.partners }}</p>
        <div class="flex flex-wrap items-center justify-center gap-6">
          <NuxtLink
            v-for="partner in partners"
            :key="partner.name"
            :to="partner.url"
            target="_blank"
            class="group overflow-hidden rounded-xl"
          >
            <div
              class="flex h-16 w-40 items-center justify-center bg-white px-5 py-3 transition-transform duration-200 group-hover:scale-105 md:h-20 md:w-52"
            >
              <Icon
                v-if="partner.icon"
                :name="partner.icon"
                :aria-label="partner.name"
                class="no-contrast h-full w-full"
              />
              <img
                v-else
                :src="partner.logo"
                :alt="partner.name"
                class="no-contrast h-full w-full object-contain"
              />
            </div>
          </NuxtLink>
        </div>
      </UContainer>
    </div>

    <CallToAction />
  </div>
</template>
