<script setup lang="ts">
  const appConfig = useAppConfig()

  const { data: rejoindreData } = await useAsyncData('rejoindre', () =>
    queryCollection('rejoindre').first(),
  )
  const option = rejoindreData.value?.options.find((o) => o.slug === 'rejoindre-bureau')
  const form = rejoindreData.value?.form

  if (!option || !form) {
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
      <div class="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div class="text-center">
          <UIcon :name="option.icon" class="mx-auto mb-6 h-20 w-20" :class="option.color" />
          <h1 class="font-title mb-4 text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
            {{ option.title }}
          </h1>
          <p class="mb-8 text-lg text-gray-600 dark:text-gray-300">
            {{ form.redirectText }}
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
            {{ form.buttonLabel }}
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
