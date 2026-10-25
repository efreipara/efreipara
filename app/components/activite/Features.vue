<script setup lang="ts">
  import type { ActivityType } from '~/utils/activities'

  defineProps<{
    activite: ActivityType
    label: string
    features: { title: string; description: string; icon: string }[]
    band?: boolean
  }>()

  const { labels } = await useLabels()
</script>

<template>
  <SharedSection
    :headline="labels.activity.headlines.features"
    headline-tone="text-activity-strong"
    :title="fillLabel(labels.activity.features, { label })"
    :band="band"
    :class="activityClass(activite)"
  >
    <ul class="grid gap-x-10 gap-y-8 sm:grid-cols-2">
      <UPageFeature
        v-for="feature in features"
        :key="feature.title"
        as="li"
        :icon="feature.icon"
        :title="feature.title"
        :description="feature.description"
        :ui="{
          leading: 'bg-tint-10 size-10 shrink-0 justify-center rounded-xl p-0',
          leadingIcon: 'text-activity size-5',
          title: 'text-highlighted text-base text-wrap',
          description: 'text-wrap',
        }"
      />
    </ul>
  </SharedSection>
</template>
