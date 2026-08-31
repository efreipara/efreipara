<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'

  const props = defineProps<{ activite: ActivityType }>()

  const { data: page } = await useAsyncData(props.activite, () =>
    queryCollection('activites').where('stem', '=', `pages/activites/${props.activite}`).first(),
  )
</script>

<template>
  <div>
    <ActiviteHero
      v-if="page"
      :activite="activite"
      :title="page.title"
      :description="page.description"
      :label="page.label"
      :alt="page.alt"
    />
    <ActiviteStats v-if="page?.stats?.length" :activite="activite" :stats="page.stats" />
    <ActiviteIntro v-if="page?.intro?.length" :activite="activite" :paragraphs="page.intro" />
    <ActiviteCarousel v-if="page?.imageCount" :activite="activite" :image-count="page.imageCount" />
    <ActiviteFeatures
      v-if="page?.features?.length"
      :activite="activite"
      :label="page.label"
      :features="page.features"
    />
    <ActiviteSteps v-if="page?.steps?.length" :activite="activite" :steps="page.steps" />
    <ActiviteRequirements
      v-if="page?.requirements?.length"
      :activite="activite"
      :requirements="page.requirements"
    />
    <ActivitePartners :activite="activite" />
    <SharedCallToAction />
  </div>
</template>
