<script setup lang="ts">
  defineProps<{
    categories: { name: string; icon: string; color?: string }[]
  }>()

  const { getCategoryColor } = useCategoryColor()

  const scrollTo = (id: string, duration = 800) => {
    const el = document.getElementById(id)
    if (!el) return
    const headerHeight = document.querySelector('header')?.offsetHeight ?? 0
    const target = el.getBoundingClientRect().top + window.scrollY - headerHeight - 32
    const start = window.scrollY
    const distance = target - start
    const startTime = performance.now()

    const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      window.scrollTo(0, start + distance * ease(progress))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
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
