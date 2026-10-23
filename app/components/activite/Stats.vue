<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'

  defineProps<{
    activite: ActivityType
    stats: { value: string; label: string; icon: string }[]
  }>()
</script>

<template>
  <div class="bg-elevated/50" :style="activityVars(activite)">
    <UContainer class="py-12">
      <dl class="grid grid-cols-2 gap-8 lg:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="flex flex-col items-center gap-2 text-center"
        >
          <div class="bg-tint-15 flex size-10 items-center justify-center rounded-xl">
            <UIcon :name="stat.icon" class="text-activity size-5" />
          </div>
          <dd class="font-title text-activity text-3xl font-bold">
            {{ stat.value }}
          </dd>
          <dt class="text-muted text-sm">{{ stat.label }}</dt>
        </div>
      </dl>
    </UContainer>
  </div>
</template>
