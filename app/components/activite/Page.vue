<script setup lang="ts">
  import type { ActivityType } from '~/utils/activities'

  const props = defineProps<{ activite: ActivityType }>()

  const { data: page } = await useAsyncData(props.activite, () =>
    queryCollection('activites').where('stem', '=', `pages/activites/${props.activite}`).first(),
  )
  const { getPartnersByActivity } = await usePartners()
  const partners = computed(() => getPartnersByActivity(props.activite))
  const { events } = await useUpcomingEvents(props.activite)

  // Sections présentes, dans l'ordre : une sur deux sur bande, sans trou quand une section manque
  const present = computed(() =>
    (
      [
        ['stats', page.value?.stats?.length],
        ['events', events.value.length],
        ['intro', page.value?.intro?.length],
        ['carousel', page.value?.imageCount],
        ['features', page.value?.features?.length],
        ['steps', page.value?.steps?.length],
        ['requirements', page.value?.requirements?.length],
        ['partners', partners.value.length],
      ] as const
    )
      .filter(([, shown]) => !!shown)
      .map(([name]) => name),
  )
  const band = (name: (typeof present.value)[number]) => isBandSection(present.value.indexOf(name))
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
    <ActiviteStats
      v-if="page?.stats?.length"
      :activite="activite"
      :stats="page.stats"
      :band="band('stats')"
    />
    <ActiviteEvents
      v-if="events.length"
      :activite="activite"
      :events="events"
      :band="band('events')"
    />
    <ActiviteIntro v-if="page?.intro?.length" :paragraphs="page.intro" :band="band('intro')" />
    <ActiviteCarousel
      v-if="page?.imageCount"
      :activite="activite"
      :label="page.label"
      :image-count="page.imageCount"
      :band="band('carousel')"
    />
    <ActiviteFeatures
      v-if="page?.features?.length"
      :activite="activite"
      :label="page.label"
      :features="page.features"
      :band="band('features')"
    />
    <ActiviteSteps
      v-if="page?.steps?.length"
      :activite="activite"
      :steps="page.steps"
      :band="band('steps')"
    />
    <ActiviteRequirements
      v-if="page?.requirements?.length"
      :activite="activite"
      :requirements="page.requirements"
      :band="band('requirements')"
    />
    <ActivitePartners
      v-if="partners.length"
      :activite="activite"
      :partners="partners"
      :band="band('partners')"
    />
    <SharedCallToAction />
  </div>
</template>
