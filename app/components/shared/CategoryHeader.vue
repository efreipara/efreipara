<script setup lang="ts">
  defineProps<{
    name: string
    color?: string
    description?: string
    count: string
  }>()

  const { getCategoryText } = useCategoryColor()
</script>

<template>
  <div>
    <SharedHeadline v-if="count" :tone="getCategoryText(color)" class="mb-3">
      {{ count }}
    </SharedHeadline>
    <h2 class="font-title text-highlighted text-2xl sm:text-3xl">{{ name }}</h2>
    <p v-if="description" class="text-muted mt-2 max-w-2xl text-pretty">{{ description }}</p>
  </div>
</template>
