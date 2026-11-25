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
    labels.error.messages[String(statusCode)] ?? labels.error.messages.default!

  const customError = computed(() => ({
    ...props.error,
    statusMessage: errorMessage(props.error.statusCode || 500).title,
    message: errorMessage(props.error.statusCode || 500).description,
  }))

  // app.vue (et donc useSeo) n'est pas rendu à la place d'une page d'erreur
  const { data: seo } = await useContentData('seo')
  const meta = computed(() =>
    seo.value
      ? buildSeoMeta(seo.value, 'error', { title: customError.value.statusMessage })
      : undefined,
  )
  useHead({
    title: computed(() => meta.value?.title ?? customError.value.statusMessage),
    htmlAttrs: { lang: computed(() => meta.value?.htmlLang) },
    meta: [{ name: 'robots', content: 'noindex' }],
  })
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
          variant="primary"
          size="lg"
          :icon="appConfig.ui.icons.arrowLeft"
          to="/"
        />
        <UButton
          :to="club.github.issues"
          target="_blank"
          :icon="getSocial('github')?.icon"
          variant="tertiary"
          size="lg"
        >
          {{ labels.error.report }}
        </UButton>
      </template>
    </UError>
  </UApp>
</template>
