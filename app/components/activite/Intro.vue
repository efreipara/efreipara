<script setup lang="ts">
  defineProps<{
    paragraphs: string[]
    band?: boolean
  }>()
</script>

<template>
  <div :class="band && 'bg-elevated/60'">
    <UContainer class="py-12 sm:py-16">
      <div class="max-w-3xl space-y-4 text-lg leading-relaxed text-pretty">
        <MDC
          v-for="(paragraph, i) in paragraphs"
          :key="i"
          :value="paragraph"
          tag="p"
          unwrap="p"
          class="[&_strong]:text-highlighted [&_strong]:font-semibold"
        />
      </div>
    </UContainer>
  </div>
</template>
