<script setup lang="ts">
  defineProps<{
    categories: { name: string; icon: string; color?: string }[]
  }>()

  const { getCategoryColor, getCategoryText } = useCategoryColor()

  const { scrollToId } = useSmoothScroll()
</script>

<template>
  <div class="mb-16 flex flex-wrap gap-2">
    <UButton
      v-for="(category, i) in categories"
      :key="i"
      :icon="category.icon"
      color="neutral"
      variant="ghost"
      class="cursor-pointer rounded-full px-3"
      :class="[
        getCategoryColor(category.color).bg,
        getCategoryText(category.color),
        getCategoryColor(category.color).hoverBg,
      ]"
      :ui="{ leadingIcon: 'size-4' }"
      @click="scrollToId(toAnchorId(category.name))"
    >
      {{ category.name }}
    </UButton>
  </div>
</template>
