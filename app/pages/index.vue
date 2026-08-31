<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'
  import DOMPurify from 'isomorphic-dompurify'

  const { getIcon } = useEventIcon()

  const { partners } = await usePartners()
  const appConfig = useAppConfig()

  const { data: home } = await useAsyncData('home', () => queryCollection('home').first())

  const activityCssVar: Record<string, string> = {
    oa: 'var(--color-efreipara-oa)',
    tandem: 'var(--color-efreipara-tandem)',
    soufflerie: 'var(--color-efreipara-soufflerie)',
    pac: 'var(--color-efreipara-pac)',
  }
  const activityBgStyle = (type: string) => ({
    backgroundColor: `color-mix(in oklch, ${activityCssVar[type]} 10%, transparent)`,
  })

  const hoveredType = ref<string | null>(null)
  const activityCardStyle = (type: string) =>
    hoveredType.value === type ? activityBgStyle(type) : {}
</script>

<template>
  <div>
    <HomeHero />

    <!-- À propos -->
    <UContainer class="py-24">
      <h2 class="font-title mb-8 flex flex-col items-center text-center text-3xl font-bold">
        <div class="bg-primary/10 mb-4 flex size-20 items-center justify-center rounded-2xl">
          <UIcon name="efreipara:parachute" class="text-primary size-10" />
        </div>
        {{ home?.sections.about }}
      </h2>
      <div class="flex items-center gap-12">
        <div class="text-muted flex flex-1 flex-col gap-4">
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
          class="hidden h-auto w-64 shrink-0 opacity-90 md:block dark:opacity-75"
        />
      </div>
    </UContainer>

    <!-- Stats -->
    <div class="border-default border-y">
      <UContainer>
        <div class="divide-default grid grid-cols-3 divide-x">
          <div
            v-for="stat in home?.stats"
            :key="stat.description"
            class="flex flex-col items-center gap-1 py-10"
          >
            <UIcon :name="stat.icon" class="text-muted mb-1 size-5" />
            <HomeStatCounter
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

    <!-- Activités -->
    <UContainer class="py-24">
      <h2 class="font-title mb-8 text-center text-3xl font-bold">
        {{ home?.sections.activites }}
      </h2>
      <div class="mb-8 grid gap-4 sm:grid-cols-2">
        <NuxtLink
          v-for="item in home?.activites.items"
          :key="item.title"
          :to="item.to"
          class="group block"
          @mouseenter="hoveredType = item.type"
          @mouseleave="hoveredType = null"
        >
          <div
            class="border-default relative h-full rounded-2xl border p-6 transition-colors duration-300"
            :style="activityCardStyle(item.type)"
          >
            <div class="flex items-start gap-4">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-2xl"
                :style="activityBgStyle(item.type)"
              >
                <UIcon
                  :name="getIcon(item.type as ActivityType)"
                  :style="{ color: activityCssVar[item.type] }"
                  class="size-6"
                />
              </div>
              <div>
                <h3 class="mb-1.5 font-bold">{{ item.title }}</h3>
                <p class="text-muted mb-4 text-sm">{{ item.description }}</p>
                <div class="text-primary flex items-center gap-1 text-sm font-semibold">
                  <span>En savoir plus</span>
                  <UIcon
                    :name="appConfig.ui.icons.arrowRight"
                    class="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
      <div class="text-center">
        <UButton
          :to="home?.activites.link.to"
          color="neutral"
          variant="subtle"
          size="lg"
          :trailing-icon="appConfig.ui.icons.arrowRight"
          class="rounded-full"
        >
          {{ home?.activites.link.label }}
        </UButton>
      </div>
    </UContainer>

    <!-- Pourquoi Efrei Para ? -->
    <div class="border-default border-y py-24">
      <UContainer>
        <h2 class="font-title mb-10 text-center text-3xl font-bold">
          {{ home?.sections.why }}
        </h2>
        <div class="grid gap-6 sm:grid-cols-3">
          <UCard v-for="item in home?.why" :key="item.title" variant="subtle">
            <div class="flex flex-col items-center text-center">
              <div
                class="mb-5 flex size-14 items-center justify-center rounded-2xl"
                :style="activityBgStyle(item.type)"
              >
                <UIcon
                  :name="item.icon"
                  :style="{ color: activityCssVar[item.type] }"
                  class="size-7"
                />
              </div>
              <h3 class="mb-2 font-bold">{{ item.title }}</h3>
              <p class="text-muted text-sm">{{ item.description }}</p>
            </div>
          </UCard>
        </div>
      </UContainer>
    </div>

    <!-- Partenaires -->
    <div class="border-default border-t">
      <UContainer class="py-24">
        <p class="font-title mb-8 text-center text-3xl font-bold">{{ home?.sections.partners }}</p>
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

    <SharedCallToAction />
  </div>
</template>
