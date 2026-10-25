<script setup lang="ts">
  import DOMPurify from 'isomorphic-dompurify'

  defineProps<{
    paragraphs: string[]
    band?: boolean
  }>()
</script>

<template>
  <div :class="band && 'bg-elevated/60'">
    <UContainer class="py-12 sm:py-16">
      <div class="max-w-3xl space-y-4 text-lg leading-relaxed text-pretty">
        <p
          v-for="(paragraph, i) in paragraphs"
          :key="i"
          class="[&_b]:font-semibold"
          v-html="DOMPurify.sanitize(paragraph)"
        />
      </div>
    </UContainer>
  </div>
</template>
