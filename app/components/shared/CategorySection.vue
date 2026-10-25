<script setup lang="ts">
  defineProps<{
    name: string
    color?: string
    description?: string
    count: string
    band?: boolean
  }>()
</script>

<template>
  <!-- Catégorie de Documents et FAQ : en-tête collé à gauche sur grand écran, contenu à droite -->
  <section
    :id="toAnchorId(name)"
    class="scroll-mt-(--ui-header-height)"
    :class="band && 'bg-elevated/60'"
  >
    <UContainer class="grid gap-8 py-12 sm:py-16 lg:grid-cols-3 lg:gap-14">
      <SharedCategoryHeader
        :name="name"
        :color="color"
        :description="description"
        :count="count"
        class="lg:sticky lg:top-[calc(var(--ui-header-height)+2rem)] lg:self-start"
      />
      <div class="lg:col-span-2">
        <slot />
      </div>
    </UContainer>
  </section>
</template>
