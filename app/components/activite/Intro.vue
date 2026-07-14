<script setup lang="ts">
  import DOMPurify from 'isomorphic-dompurify'
  import type { ActivityType } from '~/composables/useActivities'

  defineProps<{
    activite: ActivityType
    paragraphs: string[]
  }>()

  const activityCssVar: Record<ActivityType, string> = {
    oa: 'var(--color-efreipara-oa)',
    tandem: 'var(--color-efreipara-tandem)',
    soufflerie: 'var(--color-efreipara-soufflerie)',
    pac: 'var(--color-efreipara-pac)',
  }
</script>

<template>
  <UContainer class="py-12">
    <div class="mx-auto max-w-2xl space-y-4 text-lg leading-relaxed text-pretty">
      <p
        v-for="(paragraph, i) in paragraphs"
        :key="i"
        :style="{ '--activity-color': activityCssVar[activite] }"
        class="[&_b]:font-semibold"
        v-html="DOMPurify.sanitize(paragraph)"
      />
    </div>
  </UContainer>
</template>
