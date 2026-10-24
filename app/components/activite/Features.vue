<script setup lang="ts">
  import type { ActivityType } from '~/utils/activities'

  defineProps<{
    activite: ActivityType
    label: string
    features: { title: string; description: string; icon: string }[]
  }>()

  const { labels } = await useLabels()
</script>

<template>
  <UContainer class="py-12" :class="activityClass(activite)">
    <h2 class="font-title mb-8 text-2xl font-bold">
      {{ fillLabel(labels.activity.features, { label }) }}
    </h2>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <UPageFeature
        v-for="feature in features"
        :key="feature.title"
        :icon="feature.icon"
        :title="feature.title"
        :description="feature.description"
        class="bg-tint-8 gap-4 rounded-2xl p-5"
        :ui="{
          leading: 'bg-tint-15 mt-0.5 size-10 shrink-0 rounded-xl p-0',
          leadingIcon: 'text-activity',
          title: 'text-default mb-1 text-wrap',
          description: 'mt-0 text-sm text-wrap',
        }"
      />
    </div>
  </UContainer>
</template>
