<script setup lang="ts">
  import type { NuxtError } from '#app'

  const appConfig = useAppConfig()
  const { club, getSocial } = await useClub()
  const { labels } = await useLabels()

  const props = defineProps<{
    error: NuxtError
  }>()

  console.error(props.error)

  // Titre et explication selon le code (labels.yml), message par défaut sinon
  const errorMessage = (statusCode: number) =>
    labels.value.error.messages[String(statusCode)] ?? labels.value.error.messages.default!

  // Créer un objet error personnalisé avec les messages en français
  const customError = computed(() => ({
    ...props.error,
    statusMessage: errorMessage(props.error.statusCode || 500).title,
    message: errorMessage(props.error.statusCode || 500).description,
  }))
</script>

<template>
  <UApp>
    <AppHeader />
    <SharedParachuteBg
      speed="slow"
      :size="{ min: 14, max: 50 }"
      :drift="500"
      :initial-presence="0.7"
    />
    <UError :error="customError">
      <template #links>
        <UButton
          :label="labels.error.home"
          color="neutral"
          size="lg"
          :icon="appConfig.ui.icons.arrowLeft"
          class="cursor-pointer rounded-full"
          to="/"
        />
        <UButton
          :to="club.github.issues"
          target="_blank"
          :icon="getSocial('github')?.icon"
          color="neutral"
          variant="link"
          size="lg"
        >
          {{ labels.error.report }}
        </UButton>
      </template>
    </UError>
  </UApp>
</template>
