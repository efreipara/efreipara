<script setup lang="ts">
  const { events } = await useUpcomingEvents()
  const { getIcon } = await useActivities()
  const appConfig = useAppConfig()
  const { labels } = await useLabels()

  // Événement annoncé : le plus proche dont le jour est fixé ; les autres sont comptés dans « +N »
  const event = computed(() => bannerEvent(events.value))
  const others = computed(() => events.value.length - 1)
  const title = computed(() => event.value && bannerTitle(event.value, labels.value.banner))
  const moreLabel = computed(() =>
    fillLabel(labels.value.banner.moreLabel[others.value > 1 ? 'other' : 'one'], {
      count: others.value,
    }),
  )

  const bannerId = computed(() => eventBannerId(event.value))
  const isBannerClosed = ref(false)

  onMounted(() => {
    isBannerClosed.value = sessionStorage.getItem(`banner-${bannerId.value}`) === 'true'
  })

  const showBanner = computed(() => !!event.value && !isBannerClosed.value)

  // Fermeture gérée ici et non par UBanner : sessionStorage (UBanner utilise localStorage)
  // et animation de sortie de la Transition
  const handleClose = () => {
    isBannerClosed.value = true
    if (import.meta.client) {
      sessionStorage.setItem(`banner-${bannerId.value}`, 'true')
    }
  }
</script>

<template>
  <ClientOnly>
    <!-- Ouverture en hauteur (grille 0fr → 1fr) : la page descend avec la bannière, sans saut -->
    <Transition
      appear
      enter-active-class="transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
      enter-from-class="grid-rows-[0fr] opacity-0"
      enter-to-class="grid-rows-[1fr]"
      leave-active-class="transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
      leave-from-class="grid-rows-[1fr]"
      leave-to-class="grid-rows-[0fr] opacity-0"
    >
      <div v-if="showBanner && event" class="grid" :data-goal-zone="labels.goalZones.banner">
        <div class="min-h-0 overflow-hidden">
          <UBanner
            :title="title"
            :actions="[
              ...(event.url
                ? [
                    {
                      label: labels.events.register,
                      to: event.url,
                      target: '_blank',
                      size: 'sm' as const,
                      variant: 'primary' as const,
                      trailingIcon: labels.events.registerIcon,
                    },
                  ]
                : []),
              {
                label: labels.events.info,
                to: `/activites/${event.type}`,
                size: 'sm',
                variant: 'tertiary',
                leadingIcon: getIcon(event.type),
                class: 'text-default',
              },
            ]"
            :class="[
              activityClass(event.type),
              'bg-tint-10 dark:bg-tint-18 border-tint-20 dark:border-tint-35 border-b',
            ]"
            :ui="{
              root: 'z-auto',
              container: 'h-auto gap-2 py-2.5',
              left: 'hidden lg:hidden',
              // Sous md, titre sur toute la largeur et boutons en dessous
              center: 'flex-1 flex-wrap gap-x-3 gap-y-2 md:flex-nowrap',
              // text-clip retire le truncate de Nuxt UI : le titre passe à la ligne au lieu d'être coupé
              title: 'text-default basis-full font-bold text-clip text-pretty md:flex-1',
              actions: 'gap-2',
              right: 'flex-none lg:flex-none',
            }"
          >
            <template #leading>
              <div
                class="bg-tint-20 dark:bg-tint-30 hidden size-9 shrink-0 items-center justify-center rounded-xl md:flex"
              >
                <UIcon :name="getIcon(event.type)" class="text-activity size-4" />
              </div>
            </template>
            <template #title>
              {{ title }}
              <template v-if="others > 0">
                <span aria-hidden="true">·</span>
                <NuxtLink
                  to="/#evenements"
                  :aria-label="moreLabel"
                  class="ms-1 underline underline-offset-2"
                >
                  {{ fillLabel(labels.banner.more, { count: others }) }}
                </NuxtLink>
              </template>
            </template>
            <template #close>
              <UButton
                :icon="appConfig.ui.icons.close"
                color="neutral"
                variant="ghost"
                size="sm"
                :aria-label="labels.banner.close"
                @click="handleClose"
              />
            </template>
          </UBanner>
        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>
