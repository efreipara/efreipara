<script setup lang="ts">
  import DOMPurify from 'isomorphic-dompurify'

  defineProps<{
    paragraphs: string[]
  }>()
</script>

<template>
  <UContainer class="py-12">
    <div class="mx-auto max-w-2xl space-y-4 text-lg leading-relaxed text-pretty">
      <p
        v-for="(paragraph, i) in paragraphs"
        :key="i"
        class="[&_b]:font-semibold"
        v-html="DOMPurify.sanitize(paragraph)"
      />
    </div>
  </UContainer>
</template>
