<script setup lang="ts">
  definePageMeta({
    layout: false,
  })

  useHead({
    bodyAttrs: { class: 'bg-efreipara-background' },
  })

  const { data: page } = await useAsyncData('qr', () => queryCollection('qr').first())
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
        color="white"
      />
      <div class="absolute top-4 left-4 z-20">
        <UButton
          to="/"
          :external="true"
          :icon="page?.homeIcon"
          variant="ghost"
          color="neutral"
          size="sm"
          class="cursor-pointer text-white opacity-40 transition-opacity hover:bg-white/10 hover:opacity-100"
        />
      </div>
      <div class="absolute top-4 right-4 z-20">
        <UButton
          :icon="isFullscreen ? page?.fullscreen.exitIcon : page?.fullscreen.enterIcon"
          variant="ghost"
          color="neutral"
          size="sm"
          class="cursor-pointer text-white opacity-40 transition-opacity hover:bg-white/10 hover:opacity-100"
          @click="toggleFullscreen"
        />
      </div>
      <div class="relative z-10 flex min-h-screen items-center justify-center p-4">
        <img
          src="~/assets/images/qr.svg"
          :alt="page?.alt"
          class="h-auto max-h-[90vh] w-full max-w-md object-contain"
        />
      </div>
    </div>
  </UApp>
</template>
