<script setup lang="ts">
  import type { ButtonProps } from '@nuxt/ui'

  const { buildCdnUrl } = useCdnAsset()

  const { data: cta } = await useAsyncData('cta', () => queryCollection('cta').first())

  const links = computed<ButtonProps[]>(
    () =>
      cta.value?.links.map((link) => ({
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
      :title="cta?.title"
      :description="cta?.description"
      orientation="horizontal"
      variant="naked"
      :links="links"
      class="relative"
      :ui="{ title: 'font-title' }"
    >
      <img
        :src="buildCdnUrl(cta?.image ?? '')"
        :alt="cta?.alt"
        loading="lazy"
        class="relative z-10 aspect-5/3 w-full rounded-lg object-cover"
      />
    </UPageCTA>
  </UPageSection>
</template>
