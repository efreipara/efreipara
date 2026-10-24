<script setup lang="ts">
  import type { ActivityType } from '~/utils/activities'

  defineProps<{
    activite: ActivityType
    steps: { title: string; description: string; icon: string }[]
  }>()

  const { labels } = await useLabels()
</script>

<template>
  <UContainer class="overflow-x-hidden py-12" :class="activityClass(activite)">
    <h2 class="font-title mb-8 text-2xl font-bold">{{ labels.activity.steps }}</h2>
    <UTimeline
      :items="steps.map((s, i) => ({ ...s, value: i }))"
      class="md:translate-x-[calc(50%-1rem)]"
      :ui="{
        indicator: 'ring-0',
        item: 'md:even:flex-row-reverse md:even:-translate-x-[calc(100%-2rem)] md:even:text-right',
        wrapper: 'max-w-xs',
      }"
    >
      <template #indicator="{ item }">
        <div class="bg-tint-15 flex size-8 items-center justify-center rounded-full">
          <UIcon :name="item.icon" class="text-activity size-4" />
        </div>
      </template>
    </UTimeline>
  </UContainer>
</template>
