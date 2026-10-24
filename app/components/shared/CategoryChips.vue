<script setup lang="ts">
  defineProps<{
    categories: { name: string; icon: string; color?: string }[]
  }>()

  const { getCategoryColor } = useCategoryColor()

  // Défilement natif : interrompu dès que le visiteur fait défiler ; décalage sous l'en-tête par scroll-mt des sections
  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  }
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
        getCategoryColor(category.color).text,
        getCategoryColor(category.color).hoverBg,
      ]"
      :ui="{ leadingIcon: 'size-4' }"
      @click="scrollTo(toAnchorId(category.name))"
    >
      {{ category.name }}
    </UButton>
  </div>
</template>
