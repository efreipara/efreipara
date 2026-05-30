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
      <div class="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div class="text-center">
          <UIcon
            :name="appConfig.socials.instagram.icon"
            class="mx-auto mb-6 h-20 w-20 text-[#E4405F]"
          />
          <h1 class="font-title mb-4 text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
            Suivre sur Instagram
          </h1>
          <p class="mb-8 text-lg text-gray-600 dark:text-gray-300">Redirection vers Instagram...</p>
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
