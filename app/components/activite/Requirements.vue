<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'

  defineProps<{
    activite: ActivityType
    requirements: { icon: string; label: string; description?: string }[]
  }>()

  const activityCssVar: Record<ActivityType, string> = {
    oa: 'var(--color-efreipara-oa)',
    tandem: 'var(--color-efreipara-tandem)',
    soufflerie: 'var(--color-efreipara-soufflerie)',
    pac: 'var(--color-efreipara-pac)',
  }
</script>

<template>
  <div class="bg-elevated/50">
    <UContainer class="py-12">
      <h2 class="font-title mb-8 text-2xl font-bold">Prérequis</h2>
      <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <li v-for="req in requirements" :key="req.label" class="flex items-center gap-3">
          <div
            class="flex size-8 shrink-0 items-center justify-center rounded-lg"
            :style="{
              backgroundColor: `color-mix(in oklch, ${activityCssVar[activite]} 15%, transparent)`,
            }"
          >
            <UIcon :name="req.icon" class="size-4" :style="{ color: activityCssVar[activite] }" />
          </div>
          <div>
            <p class="text-sm font-medium">{{ req.label }}</p>
            <p v-if="req.description" class="text-muted text-sm">{{ req.description }}</p>
          </div>
        </li>
      </ul>
    </UContainer>
  </div>
</template>
