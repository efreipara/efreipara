<script setup lang="ts">
  import type { NuxtError } from '#app'
  import ParachuteBg from './components/ParachuteBg.vue'

  const appConfig = useAppConfig()

  const props = defineProps<{
    error: NuxtError
  }>()

  console.error(props.error)

  // Messages d'erreur personnalisés en français
  const getCustomErrorMessage = (statusCode: number) => {
    switch (statusCode) {
      case 404:
        return 'Page introuvable'
      case 500:
        return 'Erreur interne du serveur'
      case 403:
        return 'Accès refusé'
      case 401:
        return 'Non autorisé'
      case 400:
        return 'Requête incorrecte'
      default:
        return 'Une erreur est survenue'
    }
  }

  const getCustomErrorDescription = (statusCode: number) => {
    switch (statusCode) {
      case 404:
        return "La page que vous recherchez n'existe pas ou a été déplacée."
      case 500:
        return "Une erreur interne s'est produite. Merci de nous le signaler."
      case 403:
        return "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource."
      case 401:
        return 'Vous devez vous connecter pour accéder à cette page.'
      case 400:
        return "La requête envoyée n'est pas valide."
      default:
        return "Une erreur inattendue s'est produite. Veuillez réessayer plus tard."
    }
  }

  // Créer un objet error personnalisé avec les messages en français
  const customError = computed(() => ({
    ...props.error,
    statusMessage: getCustomErrorMessage(props.error.statusCode || 500),
    message: getCustomErrorDescription(props.error.statusCode || 500),
  }))
</script>

<template>
  <UApp>
    <AppHeader />
    <ParachuteBg speed="slow" :size="{ min: 14, max: 50 }" :drift="500" :initial-presence="0.7" />
    <UError
      :error="customError"
      redirect="/"
      :clear="{
        label: 'Retour à l\'accueil',
        color: 'neutral',
        size: 'lg',
        icon: appConfig.ui.icons.arrowLeft,
        class: 'rounded-full cursor-pointer',
      }"
    >
      <template #links>
        <UButton
          label="Retour à l'accueil"
          color="neutral"
          size="lg"
          :icon="appConfig.ui.icons.arrowLeft"
          class="cursor-pointer rounded-full"
          to="/"
        />
        <ULink
          to="https://github.com/efreipara/efreipara/issues/new"
          target="_blank"
          class="flex items-center text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <UIcon :name="appConfig.socials.github.icon" class="mr-2" />
          Signaler l'erreur
        </ULink>
      </template>
    </UError>
  </UApp>
</template>
