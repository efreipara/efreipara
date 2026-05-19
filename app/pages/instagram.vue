<script setup lang="ts">
const { getSocialUrl } = useSocials()
const appConfig = useAppConfig()

const instagramUrl = getSocialUrl('Instagram')

if (!instagramUrl) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page non trouvée',
  })
}

// Redirection immédiate vers Instagram
onMounted(() => {
  window.location.href = instagramUrl
})
</script>

<template>
  <div>
    <UContainer>
      <div class="pt-24 sm:pt-32 pb-16 sm:pb-24">
        <div class="text-center">
          <UIcon
            :name="appConfig.socials.instagram.icon"
            class="w-20 h-20 mx-auto mb-6 text-[#E4405F]"
          />
          <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Suivre sur Instagram
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">Redirection vers Instagram...</p>
          <UButton
            :to="instagramUrl"
            external
            target="_blank"
            size="xl"
            color="neutral"
            class="rounded-full"
            :trailing-icon="appConfig.ui.icons.external"
          >
            Ouvrir Instagram
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
