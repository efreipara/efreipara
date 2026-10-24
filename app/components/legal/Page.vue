<script setup lang="ts">
  interface Props {
    slug: string
  }

  const props = defineProps<Props>()

  const { club, getSocial } = await useClub()

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
      <div v-if="page.updatedAt" class="border-default text-muted mt-12 border-t pt-6 text-sm">
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
      </div>
    </div>
  </UContainer>
</template>
