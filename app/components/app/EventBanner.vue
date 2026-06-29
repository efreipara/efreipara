<script setup lang="ts">
  const { nextEvent, getEventBannerUI, getEventInfoUrl, getEventBannerId, shouldShowEvent } =
    useNextEvent()

  const { getIcon } = useEventIcon()

  const bannerId = getEventBannerId()

  // Récupération des icônes depuis la configuration de l'app
  const appConfig = useAppConfig()

  // Vérifier le sessionStorage à chaque initialisation
  const getInitialClosedState = () => {
    if (import.meta.client) {
      return sessionStorage.getItem(`banner-${bannerId}`) === 'true'
    }
    return false
  }

  // Utiliser useState mais toujours vérifier sessionStorage
  const isBannerClosed = useState(`banner-closed-${bannerId}`, getInitialClosedState)

  // Synchroniser avec sessionStorage au montage
  onMounted(() => {
    if (import.meta.client) {
      isBannerClosed.value = sessionStorage.getItem(`banner-${bannerId}`) === 'true'
    }
  })

  const showBanner = computed(() => shouldShowEvent() && !isBannerClosed.value)

  // Gérer la fermeture de la bannière
  const handleClose = () => {
    isBannerClosed.value = true
    if (import.meta.client) {
      sessionStorage.setItem(`banner-${bannerId}`, 'true')
    }
  }
</script>

<template>
  <ClientOnly>
    <UBanner
      v-if="showBanner"
      :id="bannerId"
      :title="nextEvent.title"
      :icon="appConfig.efreipara.icons.extras.calendar"
      :actions="[
        {
          label: 'Inscription',
          to: nextEvent.url,
          target: '_blank',
          trailingIcon: appConfig.efreipara.icons.extras.arrowNarrowRight,
          variant: 'solid',
        },
        {
          label: 'En savoir plus',
          to: getEventInfoUrl(nextEvent.type),
          leadingIcon: getIcon(nextEvent.type),
          variant: 'solid',
        },
      ]"
      :ui="getEventBannerUI(nextEvent.type)"
      :close="false"
      :close-icon="appConfig.efreipara.icons.extras.closeCircle"
      @close="handleClose"
    >
      <template #close>
        <UButton
          :icon="appConfig.efreipara.icons.extras.closeCircle"
          color="neutral"
          variant="ghost"
          size="md"
          @click="handleClose"
        />
      </template>
    </UBanner>
  </ClientOnly>
</template>
