<script setup lang="ts">
  import type { ButtonProps, PageSectionProps } from '@nuxt/ui'

  // UPageSection avec le surtitre du site (trait + capitales) et, si demandé, une bande de fond
  const props = withDefaults(
    defineProps<{
      headline?: string
      title?: string
      description?: string
      orientation?: PageSectionProps['orientation']
      reverse?: boolean
      links?: ButtonProps[]
      band?: boolean
      ui?: PageSectionProps['ui']
    }>(),
    {
      headline: undefined,
      title: undefined,
      description: undefined,
      orientation: 'vertical',
      links: undefined,
      ui: undefined,
    },
  )

  // Section verticale avec liens : les liens passent à droite de l'en-tête sur grand écran
  const sectionUi = computed(() =>
    props.orientation === 'vertical' && props.links?.length
      ? {
          wrapper: 'flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between',
          footer: 'mt-0',
          ...props.ui,
        }
      : props.ui,
  )
</script>

<template>
  <UPageSection
    :title="title"
    :description="description"
    :links="links"
    :orientation="orientation"
    :reverse="reverse"
    :ui="sectionUi"
    :class="band && 'bg-elevated/60'"
  >
    <template v-if="headline" #headline>
      <span class="h-0.5 w-6 shrink-0 rounded-full bg-current" aria-hidden="true" />
      {{ headline }}
    </template>
    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
    <template v-if="$slots.body" #body>
      <slot name="body" />
    </template>
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </UPageSection>
</template>
