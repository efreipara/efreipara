<script setup lang="ts">
  const { getSocialUrl } = useSocials()
  const appConfig = useAppConfig()

  const discordUrl = getSocialUrl('Discord')

  if (!discordUrl) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page non trouvée',
    })
  }

  // Redirection immédiate vers Discord
  onMounted(() => {
    window.location.href = discordUrl
  })
</script>

<template>
  <div>
    <UContainer>
      <div class="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div class="text-center">
          <UIcon
            :name="appConfig.socials.discord.icon"
            class="mx-auto mb-6 h-20 w-20 text-[#5865F2]"
          />
          <h1 class="font-title mb-4 text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
            Rejoindre notre Discord
          </h1>
          <p class="mb-8 text-lg text-gray-600 dark:text-gray-300">Redirection vers Discord...</p>
          <UButton
            :to="discordUrl"
            external
            target="_blank"
            size="xl"
            color="neutral"
            class="rounded-full"
            :trailing-icon="appConfig.ui.icons.external"
          >
            Ouvrir Discord
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
