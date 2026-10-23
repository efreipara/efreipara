<script setup lang="ts">
  defineProps<{
    name: string
    icon: string
    color?: string
    description?: string
    count: string
  }>()

  const { getCategoryColor } = useCategoryColor()
</script>

<template>
  <div class="flex items-center gap-4">
    <div
      class="flex size-12 shrink-0 items-center justify-center rounded-2xl"
      :class="getCategoryColor(color).bg"
    >
      <UIcon :name="icon" class="size-6" :class="getCategoryColor(color).text" />
    </div>
    <div class="min-w-0 flex-1">
      <h2 class="font-title text-xl font-bold">{{ name }}</h2>
      <p v-if="description" class="text-muted text-sm">{{ description }}</p>
    </div>
    <UBadge color="neutral" variant="subtle" size="sm" class="shrink-0">{{ count }}</UBadge>
  </div>
</template>
