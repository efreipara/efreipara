<script setup lang="ts">
  const { event, getEventInfoUrl, getEventBannerId, shouldShowEvent } = useNextEvent()
  const { getIcon } = useEventIcon()
  const appConfig = useAppConfig()

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
    <Transition
      appear
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="-translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-full opacity-0"
    >
      <UBanner
        v-if="showBanner && event"
        :title="event.title"
        :actions="[
          {
            label: 'Inscription',
            to: event.url,
            target: '_blank',
            size: 'sm',
            variant: 'subtle',
            trailingIcon: appConfig.efreipara.icons.extras.arrowNarrowRight,
            class: 'rounded-full',
          },
          {
            label: 'En savoir plus',
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
            aria-label="Fermer la bannière"
            class="cursor-pointer rounded-full"
            @click="handleClose"
          />
        </template>
      </UBanner>
    </Transition>
  </ClientOnly>
</template>
