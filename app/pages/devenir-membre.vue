<script setup lang="ts">
const { getJoinOptionBySlug } = useJoinOptions()
const appConfig = useAppConfig()

const option = getJoinOptionBySlug('devenir-membre')

if (!option) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page non trouvée',
  })
}

// Redirection immédiate vers le formulaire Google
onMounted(() => {
  window.location.href = option.link
})
</script>

<template>
  <div>
    <UContainer>
      <div class="pt-24 sm:pt-32 pb-16 sm:pb-24">
        <div class="text-center">
          <UIcon :name="option.icon" class="w-20 h-20 mx-auto mb-6" :class="option.color" />
          <h1 class="text-4xl sm:text-5xl font-title font-bold text-gray-900 dark:text-white mb-4">
            {{ option.title }}
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Redirection vers le formulaire...
          </p>
          <UButton
            :to="option.link"
            external
            target="_blank"
            size="xl"
            color="neutral"
            class="rounded-full"
            :trailing-icon="appConfig.ui.icons.external"
          >
            Ouvrir le formulaire
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
