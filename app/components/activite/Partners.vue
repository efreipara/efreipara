<script setup lang="ts">
  import type { Partner } from '~/composables/usePartners'
  import type { ActivityType } from '~/utils/activities'

  defineProps<{ activite: ActivityType; partners: Partner[]; band?: boolean }>()

  const { labels } = await useLabels()
</script>

<template>
  <SharedSection
    :headline="labels.activity.headlines.partners"
    headline-tone="text-activity-strong"
    :title="labels.activity.partners"
    :band="band"
    :class="activityClass(activite)"
  >
    <SharedPartnerLogos :partners="partners" />
  </SharedSection>
</template>
