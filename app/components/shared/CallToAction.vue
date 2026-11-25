<script setup lang="ts">
  import type { ButtonProps } from '@nuxt/ui'

  const { cdnImage } = useCdnAsset()

  const { t } = await useT('cta')

  const links = computed<ButtonProps[]>(
    () =>
      t.links.map((link) => ({
        label: link.label,
        to: link.to,
        icon: link.icon,
        variant: link.variant ?? 'primary',
        size: 'lg',
      })) ?? [],
  )
</script>

<template>
  <USeparator />
  <UPageSection :ui="{ container: 'p-0!' }">
    <SharedParachuteBg
      :count="50"
      :initial-presence="0.5"
      speed="slow"
      color="rgb(9 41 84 / 0.12)"
      color-dark="rgb(255 255 255 / 0.12)"
    />
    <UPageCTA
      :title="t.title"
      :description="t.description"
      orientation="horizontal"
      variant="naked"
      :links="links"
      class="relative"
      :ui="{ title: 'font-title' }"
    >
      <img
        v-bind="cdnImage(t.image ?? '', 'half')"
        :alt="t.alt"
        loading="lazy"
        class="relative z-10 aspect-5/3 w-full rounded-lg object-cover"
      />
    </UPageCTA>
  </UPageSection>
</template>
