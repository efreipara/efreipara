<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'

  defineProps<{
    activite: ActivityType
    requirements: { icon: string; label: string; description?: string }[]
  }>()
</script>

<template>
  <div class="bg-elevated/50" :class="activityClass(activite)">
    <UContainer class="py-12">
      <h2 class="font-title mb-8 text-2xl font-bold">Prérequis</h2>
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
    </UContainer>
  </div>
</template>
