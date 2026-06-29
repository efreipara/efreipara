<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'

  const { getIcon } = useEventIcon()
  const { getColor } = useActivityColor()
  const appConfig = useAppConfig()

  const { data: page } = await useAsyncData('galerie', () => queryCollection('galerie').first())

  const activeFilter = ref<string | null>(null)

  const activityTypes = computed(() => {
    if (!page.value?.items) return []
    return [...new Set(page.value.items.map((item) => item.type))]
  })

  const filteredItems = computed(() => {
    if (!page.value?.items) return []
    const items = activeFilter.value
      ? page.value.items.filter((item) => item.type === activeFilter.value)
      : [...page.value.items]
    return items.sort((a, b) => b.date.localeCompare(a.date))
  })

  const heroItem = computed(() => filteredItems.value[0] ?? null)
  const restItems = computed(() => filteredItems.value.slice(1))

  const showHeroLayout = computed(() => !activeFilter.value && filteredItems.value.length >= 3)

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(
      new Date(iso),
    )

  const typeLabel: Record<string, string> = {
    soufflerie: 'Soufflerie',
    tandem: 'Tandem',
    oa: 'Ouverture Auto.',
    pac: 'PAC',
  }
</script>

<template>
  <div>
    <SharedPageHero :title="page?.hero.title" :description="page?.hero.description" />

    <UContainer class="pb-16">
      <!-- Filtres par type d'activité -->
      <div class="mb-8 flex flex-wrap gap-2">
        <button
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
          :class="
            !activeFilter
              ? 'bg-primary text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
          "
          @click="activeFilter = null"
        >
          Tout voir
        </button>
        <button
          v-for="type in activityTypes"
          :key="type"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
          :class="
            activeFilter === type
              ? 'bg-primary text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
          "
          @click="activeFilter = activeFilter === type ? null : type"
        >
          <UIcon
            :name="getIcon(type as ActivityType)"
            class="size-4"
            :class="activeFilter === type ? 'text-white' : `text-${getColor(type as ActivityType)}`"
          />
          {{ typeLabel[type] ?? type }}
        </button>
      </div>

      <!-- Grille photo -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Item hero : 2 cols × 2 lignes sur lg -->
        <NuxtLink
          v-if="heroItem"
          :key="heroItem.url"
          :to="heroItem.url"
          target="_blank"
          external
          class="group relative block overflow-hidden rounded-2xl"
          :class="showHeroLayout ? 'lg:col-span-2 lg:row-span-2' : ''"
        >
          <div
            class="aspect-3/2 w-full overflow-hidden"
            :class="showHeroLayout ? 'lg:aspect-[unset] lg:h-full' : ''"
          >
            <img
              :src="heroItem.photo"
              :alt="heroItem.title"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div
            class="pointer-events-none absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/10 transition-opacity duration-300 group-hover:opacity-95"
          />
          <div class="absolute top-3 left-3">
            <div
              class="flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
            >
              <UIcon
                :name="getIcon(heroItem.type as ActivityType)"
                :class="`text-${getColor(heroItem.type as ActivityType)}`"
                class="size-3.5"
              />
              {{ typeLabel[heroItem.type] ?? heroItem.type }}
            </div>
          </div>
          <div
            class="absolute right-0 bottom-0 left-0 p-4 text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]"
          >
            <h3
              class="font-title mb-1.5 leading-tight font-bold"
              :class="showHeroLayout ? 'lg:text-xl' : 'text-base'"
            >
              {{ heroItem.title }}
            </h3>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-white/70">
              <span class="flex items-center gap-1">
                <UIcon :name="appConfig.efreipara.icons.extras.calendar" class="size-3" />
                {{ formatDate(heroItem.date) }}
              </span>
              <span class="flex items-center gap-1">
                <UIcon :name="appConfig.efreipara.icons.contact.mapPin" class="size-3" />
                {{ heroItem.location }}
              </span>
            </div>
            <div class="mt-2 flex items-center gap-1 text-xs font-semibold text-white/90">
              {{
                heroItem.source
                  ? `${page?.hero.linkLabel} sur ${heroItem.source}`
                  : page?.hero.linkLabel
              }}
              <UIcon
                :name="appConfig.ui.icons.external"
                class="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </div>
          </div>
        </NuxtLink>

        <!-- Items suivants -->
        <NuxtLink
          v-for="galerie in restItems"
          :key="galerie.url"
          :to="galerie.url"
          target="_blank"
          external
          class="group relative block overflow-hidden rounded-2xl"
        >
          <div class="aspect-3/2 w-full overflow-hidden">
            <img
              :src="galerie.photo"
              :alt="galerie.title"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div
            class="pointer-events-none absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/10 transition-opacity duration-300 group-hover:opacity-95"
          />
          <div class="absolute top-3 left-3">
            <div
              class="flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
            >
              <UIcon
                :name="getIcon(galerie.type as ActivityType)"
                :class="`text-${getColor(galerie.type as ActivityType)}`"
                class="size-3.5"
              />
              {{ typeLabel[galerie.type] ?? galerie.type }}
            </div>
          </div>
          <div
            class="absolute right-0 bottom-0 left-0 p-4 text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]"
          >
            <h3 class="font-title mb-1.5 text-base leading-tight font-bold">{{ galerie.title }}</h3>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-white/70">
              <span class="flex items-center gap-1">
                <UIcon :name="appConfig.efreipara.icons.extras.calendar" class="size-3" />
                {{ formatDate(galerie.date) }}
              </span>
              <span class="flex items-center gap-1">
                <UIcon :name="appConfig.efreipara.icons.contact.mapPin" class="size-3" />
                {{ galerie.location }}
              </span>
            </div>
            <div class="mt-2 flex items-center gap-1 text-xs font-semibold text-white/90">
              {{
                galerie.source
                  ? `${page?.hero.linkLabel} sur ${galerie.source}`
                  : page?.hero.linkLabel
              }}
              <UIcon
                :name="appConfig.ui.icons.external"
                class="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </div>
          </div>
        </NuxtLink>
      </div>
    </UContainer>

    <SharedCallToAction />
  </div>
</template>
