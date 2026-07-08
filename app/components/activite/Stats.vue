<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'

  defineProps<{
    activite: ActivityType
    stats: { value: string; label: string; icon: string }[]
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
      <dl class="grid grid-cols-2 gap-8 lg:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="flex flex-col items-center gap-2 text-center"
        >
          <div
            class="flex size-10 items-center justify-center rounded-xl"
            :style="{
              backgroundColor: `color-mix(in oklch, ${activityCssVar[activite]} 15%, transparent)`,
            }"
          >
            <UIcon :name="stat.icon" class="size-5" :style="{ color: activityCssVar[activite] }" />
          </div>
          <dd class="font-title text-3xl font-bold" :style="{ color: activityCssVar[activite] }">
            {{ stat.value }}
          </dd>
          <dt class="text-muted text-sm">{{ stat.label }}</dt>
        </div>
      </dl>
    </UContainer>
  </div>
</template>
