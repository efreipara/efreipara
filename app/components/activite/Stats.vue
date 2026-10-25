<script setup lang="ts">
  import type { ActivityType } from '~/utils/activities'

  defineProps<{
    activite: ActivityType
    stats: { value: string; label: string; icon: string }[]
  }>()
</script>

<template>
  <div class="bg-elevated/50" :class="activityClass(activite)">
    <UContainer class="py-12">
      <dl class="grid grid-cols-2 gap-8 lg:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="flex flex-col items-center gap-2 text-center"
        >
          <!-- dt avant dd (exigé par le HTML) ; le libellé reste affiché sous le chiffre -->
          <dt class="text-muted order-last text-sm">{{ stat.label }}</dt>
          <dd class="flex flex-col items-center gap-2">
            <span class="bg-tint-15 flex size-10 items-center justify-center rounded-xl">
              <UIcon :name="stat.icon" class="text-activity size-5" />
            </span>
            <span class="font-title text-activity-strong text-3xl font-bold">{{ stat.value }}</span>
          </dd>
        </div>
      </dl>
    </UContainer>
  </div>
</template>
