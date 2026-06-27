<script setup lang="ts">
  defineProps<{
    categories: { name: string; icon: string; color?: string }[]
  }>()

  const { getCategoryColor } = useCategoryColor()

  const categoryId = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const headerHeight = document.querySelector('header')?.offsetHeight ?? 0
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 32
    window.scrollTo({ top, behavior: 'smooth' })
  }
</script>

<template>
  <div class="mb-16 flex flex-wrap gap-2">
    <button
      v-for="(category, i) in categories"
      :key="i"
      class="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
      :class="[getCategoryColor(category.color).bg, getCategoryColor(category.color).text, getCategoryColor(category.color).hoverBg]"
      @click="scrollTo(categoryId(category.name))"
    >
      <UIcon :name="category.icon" class="size-4" />
      {{ category.name }}
    </button>
  </div>
</template>
