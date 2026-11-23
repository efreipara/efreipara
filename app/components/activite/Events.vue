<script setup lang="ts">
  import type { ActivityType } from '~/utils/activities'
  import type { EventItem } from '~/utils/event'

  defineProps<{
    activite: ActivityType
    events: EventItem[]
    band?: boolean
  }>()

  const { labels } = await useLabels()
</script>

<template>
  <SharedSection
    :headline="labels.activity.headlines.events"
    headline-tone="text-activity-strong"
    :title="labels.activity.events"
    :band="band"
    :class="activityClass(activite)"
  >
    <SharedEventList :events="events" />
  </SharedSection>
</template>
