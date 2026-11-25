<script setup lang="ts">
  import type { ActivityType } from '~/utils/activities'

  const props = defineProps<{ activite: ActivityType }>()

  const { t } = await useT('activites', {
    key: props.activite,
    query: (q, locale) => q.where('stem', '=', activityStem(props.activite, locale)).first(),
  })
  const { getPartnersByActivity } = await usePartners()
  const partners = computed(() => getPartnersByActivity(props.activite))
  const { events } = await useUpcomingEvents(props.activite)

  // Sections présentes, dans l'ordre : une sur deux sur bande, sans trou quand une section manque
  const present = computed(() =>
    (
      [
        ['stats', t.stats?.length],
        ['events', events.value.length],
        ['intro', t.intro?.length],
        ['carousel', t.imageCount],
        ['features', t.features?.length],
        ['steps', t.steps?.length],
        ['requirements', t.requirements?.length],
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
      v-if="t.title"
      :activite="activite"
      :title="t.title"
      :description="t.description"
      :label="t.label"
      :alt="t.alt"
    />
    <ActiviteStats
      v-if="t.stats?.length"
      :activite="activite"
      :stats="t.stats"
      :band="band('stats')"
    />
    <ActiviteEvents
      v-if="events.length"
      :activite="activite"
      :events="events"
      :band="band('events')"
    />
    <ActiviteIntro v-if="t.intro?.length" :paragraphs="t.intro" :band="band('intro')" />
    <ActiviteCarousel
      v-if="t.imageCount"
      :activite="activite"
      :label="t.label"
      :image-count="t.imageCount"
      :band="band('carousel')"
    />
    <ActiviteFeatures
      v-if="t.features?.length"
      :activite="activite"
      :label="t.label"
      :features="t.features"
      :band="band('features')"
    />
    <ActiviteSteps
      v-if="t.steps?.length"
      :activite="activite"
      :steps="t.steps"
      :band="band('steps')"
    />
    <ActiviteRequirements
      v-if="t.requirements?.length"
      :activite="activite"
      :requirements="t.requirements"
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
