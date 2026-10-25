<script setup lang="ts">
  // Surtitre du site : trait (ou icône) puis texte en capitales espacées
  withDefaults(defineProps<{ icon?: string; tone?: string; as?: string }>(), {
    icon: undefined,
    tone: 'text-primary',
    as: 'div',
  })
</script>

<template>
  <component
    :is="as"
    class="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase"
    :class="tone"
  >
    <UIcon v-if="icon" :name="icon" class="size-4 shrink-0" />
    <span v-else class="h-0.5 w-6 shrink-0 rounded-full bg-current" aria-hidden="true" />
    <slot />
  </component>
</template>
