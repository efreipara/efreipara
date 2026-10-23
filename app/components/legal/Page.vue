<script setup lang="ts">
  interface Props {
    slug: string
  }

  const props = defineProps<Props>()

  const appConfig = useAppConfig()

  useSeo(props.slug)

  const { data: page } = await useAsyncData(props.slug, () =>
    queryCollection('legal').where('stem', '=', `pages/legal/${props.slug}`).first(),
  )
</script>

<template>
  <UContainer class="mt-15 max-w-4xl px-4 py-8">
    <div v-if="page">
      <div class="legal-content">
        <ContentRenderer :value="page" />
      </div>
      <div v-if="page.updatedAt" class="mt-12 border-t border-gray-800 pt-6 text-sm text-gray-400">
        Dernière mise à jour :
        {{
          new Date(page.updatedAt).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        }}
      </div>
    </div>
    <div v-else class="py-12 text-center">
      <h1 class="font-title mb-4 text-2xl font-bold">Page non trouvée</h1>
      <p>Le contenu demandé n'existe pas.</p>
      <div class="mt-4 flex justify-center">
        <ULink
          :to="appConfig.socials.github.issues"
          target="_blank"
          class="flex items-center text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <UIcon :name="appConfig.socials.github.icon" class="mr-2" />
          Signaler l'erreur
        </ULink>
      </div>
    </div>
  </UContainer>
</template>
