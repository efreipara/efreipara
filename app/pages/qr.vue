<script setup lang="ts">
  definePageMeta({
    layout: false,
  })

  useHead({
    bodyAttrs: { class: 'bg-efreipara-background' },
  })

  const appConfig = useAppConfig()
  const isFullscreen = ref(false)

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', () => {
      isFullscreen.value = !!document.fullscreenElement
    })
  })
</script>

<template>
  <UApp>
    <div class="bg-efreipara-background relative min-h-screen">
      <SharedParachuteBg
        speed="slow"
        :size="{ min: 14, max: 50 }"
        :drift="500"
        :initial-presence="0.7"
        color="text-white"
      />
      <div class="absolute top-4 left-4 z-20">
        <UButton
          to="/"
          :external="true"
          icon="efreipara:parachute"
          variant="ghost"
          color="neutral"
          size="sm"
          class="opacity-40 transition-opacity hover:opacity-100"
        />
      </div>
      <div class="absolute top-4 right-4 z-20">
        <UButton
          :icon="isFullscreen ? appConfig.ui.icons.minimize : appConfig.ui.icons.maximize"
          variant="ghost"
          color="neutral"
          size="sm"
          class="opacity-40 transition-opacity hover:opacity-100"
          @click="toggleFullscreen"
        />
      </div>
      <div class="relative z-10 flex min-h-screen items-center justify-center p-4">
        <img
          src="~/assets/images/qr.svg"
          alt="QR Code Efrei Para"
          class="h-auto max-h-[90vh] w-full max-w-md object-contain"
        />
      </div>
    </div>
  </UApp>
</template>
