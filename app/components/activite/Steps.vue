<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'

  defineProps<{
    activite: ActivityType
    steps: { title: string; description: string; icon: string }[]
  }>()
</script>

<template>
  <UContainer class="overflow-x-hidden py-12">
    <h2 class="font-title mb-8 text-2xl font-bold">Comment ça se passe ?</h2>
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
        <div
          class="flex size-8 items-center justify-center rounded-full"
          :style="{
            backgroundColor: activityTint(activite, 15),
          }"
        >
          <UIcon :name="item.icon" class="size-4" :style="{ color: activityColor(activite) }" />
        </div>
      </template>
    </UTimeline>
  </UContainer>
</template>
