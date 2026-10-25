<script setup lang="ts">
  import type { ActivityType } from '~/utils/activities'

  defineProps<{
    activite: ActivityType
    requirements: { icon: string; label: string; description?: string }[]
    band?: boolean
  }>()

  const { labels } = await useLabels()
</script>

<template>
  <SharedSection
    :headline="labels.activity.headlines.requirements"
    headline-tone="text-activity-strong"
    :title="labels.activity.requirements"
    :band="band"
    :class="activityClass(activite)"
  >
    <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <UPageFeature
        v-for="req in requirements"
        :key="req.label"
        as="li"
        :icon="req.icon"
        :title="req.label"
        :description="req.description"
        class="items-center gap-3"
        :ui="{
          leading: 'bg-tint-15 size-8 shrink-0 rounded-lg p-0',
          leadingIcon: 'text-activity size-4',
          title: 'text-default text-sm font-medium text-wrap',
          description: 'mt-0 text-sm text-wrap',
        }"
      />
    </ul>
  </SharedSection>
</template>
