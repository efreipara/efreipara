<script setup lang="ts">
  const { event, getEventInfoUrl, getEventBannerId, shouldShowEvent } = useNextEvent()
  const { getIcon } = await useActivities()
  const appConfig = useAppConfig()
  const { labels } = await useLabels()

  const bannerId = computed(() => getEventBannerId())
  const isBannerClosed = ref(false)

  onMounted(() => {
    isBannerClosed.value = sessionStorage.getItem(`banner-${bannerId.value}`) === 'true'
  })

  const showBanner = computed(() => !!event.value && shouldShowEvent() && !isBannerClosed.value)

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
      <div v-if="showBanner && event" class="grid">
        <div class="min-h-0 overflow-hidden">
          <UBanner
            :title="event.title"
            :actions="[
              {
                label: labels.banner.register,
                to: event.url,
                target: '_blank',
                size: 'sm',
                variant: 'subtle',
                trailingIcon: labels.banner.registerIcon,
                class: 'rounded-full',
              },
              {
                label: labels.banner.info,
                to: getEventInfoUrl(event.type),
                size: 'sm',
                variant: 'ghost',
                leadingIcon: getIcon(event.type),
                class: 'hidden rounded-full sm:flex',
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
              center: 'flex-1 gap-3',
              title: 'text-default flex-1 font-bold',
              actions: 'gap-2',
              right: 'flex-none lg:flex-none',
            }"
          >
            <template #leading>
              <div
                class="bg-tint-20 dark:bg-tint-30 hidden size-9 shrink-0 items-center justify-center rounded-xl sm:flex"
              >
                <UIcon :name="getIcon(event.type)" class="text-activity size-4" />
              </div>
            </template>
            <template #close>
              <UButton
                :icon="appConfig.ui.icons.close"
                color="neutral"
                variant="ghost"
                size="sm"
                :aria-label="labels.banner.close"
                class="cursor-pointer rounded-full"
                @click="handleClose"
              />
            </template>
          </UBanner>
        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>
