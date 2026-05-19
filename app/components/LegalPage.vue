<script setup lang="ts">
interface Props {
  slug: string
}

const props = defineProps<Props>()

const appConfig = useAppConfig()

useSeo(props.slug)

const { data: page } = await useAsyncData(props.slug, () =>
  queryCollection('legal').path(`/${props.slug}`).first(),
)
</script>

<template>
  <UContainer class="mt-15 px-4 py-8 max-w-4xl">
    <div v-if="page">
      <ContentRenderer :value="page" />
      <div v-if="page.updatedAt" class="text-sm text-gray-400 mt-12 pt-6 border-t border-gray-800">
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
    <div v-else class="text-center py-12">
      <h1 class="text-2xl font-bold mb-4">Page non trouvée</h1>
      <p>Le contenu demandé n'existe pas.</p>
      <div class="flex justify-center mt-4">
        <ULink
          to="https://github.com/efreipara/efreipara/issues/new"
          target="_blank"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center"
        >
          <UIcon :name="appConfig.socials.github.icon" class="mr-2" />
          Signaler l'erreur
        </ULink>
      </div>
    </div>
  </UContainer>
</template>
