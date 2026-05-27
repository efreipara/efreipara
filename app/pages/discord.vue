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
      <div class="pt-24 sm:pt-32 pb-16 sm:pb-24">
        <div class="text-center">
          <UIcon
            :name="appConfig.socials.discord.icon"
            class="w-20 h-20 mx-auto mb-6 text-[#5865F2]"
          />
          <h1 class="text-4xl sm:text-5xl font-title font-bold text-gray-900 dark:text-white mb-4">
            Rejoindre notre Discord
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">Redirection vers Discord...</p>
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
