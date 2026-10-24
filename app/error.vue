<script setup lang="ts">
  import type { NuxtError } from '#app'

  const appConfig = useAppConfig()
  const { club, getSocial } = await useClub()

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
    <SharedParachuteBg
      speed="slow"
      :size="{ min: 14, max: 50 }"
      :drift="500"
      :initial-presence="0.7"
    />
    <UError :error="customError">
      <template #links>
        <UButton
          label="Retour à l'accueil"
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
          Signaler l'erreur
        </UButton>
      </template>
    </UError>
  </UApp>
</template>
