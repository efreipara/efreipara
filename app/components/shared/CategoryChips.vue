<script setup lang="ts">
  defineProps<{
    categories: { name: string; icon: string; color?: string }[]
  }>()

  const { getCategoryColor } = useCategoryColor()

  // Défilement natif ; décalage sous l'en-tête par scroll-mt des sections.
  // Chromium n'interrompt pas un défilement doux lancé par script : la première action du
  // visiteur (molette, toucher, clavier, clic) l'arrête là où il en est.
  const userInputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
  let stopListening: (() => void) | undefined

  const abortScroll = () => {
    window.scrollTo({ top: window.scrollY, behavior: 'instant' })
    stopListening?.()
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    stopListening?.()
    if (prefersReducedMotion()) {
      el.scrollIntoView({ block: 'start' })
      return
    }
    const onEnd = () => stopListening?.()
    userInputs.forEach((type) => addEventListener(type, abortScroll, { passive: true }))
    addEventListener('scrollend', onEnd)
    stopListening = () => {
      userInputs.forEach((type) => removeEventListener(type, abortScroll))
      removeEventListener('scrollend', onEnd)
      stopListening = undefined
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  onBeforeUnmount(() => stopListening?.())
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
