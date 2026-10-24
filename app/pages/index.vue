<script setup lang="ts">
  import DOMPurify from 'isomorphic-dompurify'

  const { getIcon } = await useActivities()

  const { partners } = await usePartners()
  const appConfig = useAppConfig()

  const { data: home } = await useAsyncData('home', () => queryCollection('home').first())
  const { data: cards } = await useAsyncData('home-activites', () =>
    queryCollection('activites').select('stem', 'card').all(),
  )
  const activityCards = computed(() => orderActivities(cards.value ?? []))
</script>

<template>
  <div>
    <HomeHero :links="home?.hero.links ?? []" :scroll-icon="home?.hero.scrollIcon ?? ''" />

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
        <UPageCard
          v-for="item in activityCards"
          :key="item.key"
          :to="item.to"
          :title="item.card.title"
          class="group"
          :class="activityClass(item.key)"
          :ui="{
            root: 'border-default hover:bg-tint-10 rounded-2xl border ring-0 duration-200 active:scale-[0.98]',
            container: 'p-6 sm:p-6',
            wrapper: 'flex-row gap-4',
            leading: 'bg-tint-10 mb-0 size-12 shrink-0 justify-center rounded-2xl',
          }"
        >
          <template #leading>
            <UIcon :name="getIcon(item.key)" class="text-activity size-6" />
          </template>
          <template #body>
            <h3 class="mb-1.5 font-bold">{{ item.card.title }}</h3>
            <p class="text-muted mb-4 text-sm">{{ item.card.description }}</p>
            <div class="text-primary flex items-center gap-1 text-sm font-semibold">
              <span>En savoir plus</span>
              <UIcon
                :name="appConfig.ui.icons.arrowRight"
                class="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </div>
          </template>
        </UPageCard>
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
            <div class="flex flex-col items-center text-center" :class="activityClass(item.type)">
              <div class="bg-tint-10 mb-5 flex size-14 items-center justify-center rounded-2xl">
                <UIcon :name="item.icon" class="text-activity size-7" />
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
        <SharedPartnerLogos :partners="partners" class="justify-center" />
      </UContainer>
    </div>

    <SharedCallToAction />
  </div>
</template>
