<script setup lang="ts">
  defineProps<{
    categories: { name: string; icon: string; color?: string }[]
  }>()

  // Tailwind scan: bg-blue-500/10 text-blue-500 bg-green-500/10 text-green-500
  // bg-purple-500/10 text-purple-500 bg-red-500/10 text-red-500
  // bg-orange-500/10 text-orange-500 bg-gray-500/10 text-gray-500
  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
    green: { bg: 'bg-green-500/10', text: 'text-green-500' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
    red: { bg: 'bg-red-500/10', text: 'text-red-500' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-500' },
    gray: { bg: 'bg-gray-500/10', text: 'text-gray-500' },
  }

  const getCategoryColor = (color?: string) =>
    colorMap[color ?? ''] ?? { bg: 'bg-primary/10', text: 'text-primary' }

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
      class="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-opacity hover:opacity-80"
      :class="[getCategoryColor(category.color).bg, getCategoryColor(category.color).text]"
      @click="scrollTo(categoryId(category.name))"
    >
      <UIcon :name="category.icon" class="size-4" />
      {{ category.name }}
    </button>
  </div>
</template>
