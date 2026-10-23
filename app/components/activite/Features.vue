<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'

  defineProps<{
    activite: ActivityType
    label: string
    features: { title: string; description: string; icon: string }[]
  }>()
</script>

<template>
  <UContainer class="py-12">
    <h2 class="font-title mb-8 text-2xl font-bold">Pourquoi choisir {{ label }} ?</h2>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="flex gap-4 rounded-2xl p-5"
        :style="{
          backgroundColor: activityTint(activite, 8),
        }"
      >
        <div
          class="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl"
          :style="{
            backgroundColor: activityTint(activite, 15),
          }"
        >
          <UIcon :name="feature.icon" class="size-5" :style="{ color: activityColor(activite) }" />
        </div>
        <div>
          <p class="mb-1 font-semibold">{{ feature.title }}</p>
          <p class="text-muted text-sm">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </UContainer>
</template>
