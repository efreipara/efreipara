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
        variant: link.variant as ButtonProps['variant'],
        size: 'lg',
        color: 'neutral',
        class: 'rounded-full',
      })) ?? [],
  )
</script>

<template>
  <USeparator />
  <UPageSection :ui="{ container: 'p-0!' }">
    <!-- Fond de parachutes animés avec densité réduite -->
    <SharedParachuteBg
      :count="50"
      :initial-presence="0.5"
      speed="slow"
      color="rgb(9 41 84 / 0.12)"
      color-dark="rgb(255 255 255 / 0.12)"
    />
    <!-- Section CTA (Call To Action) pour encourager les visiteurs à rejoindre le club -->
    <UPageCTA
      :title="cta?.title"
      :description="cta?.description"
      orientation="horizontal"
      variant="naked"
      :links="links"
      class="relative"
      :ui="{ title: 'font-title' }"
    >
      <!-- Image depuis le CDN pour de meilleures performances -->
      <img
        :src="buildCdnUrl(cta?.image ?? '')"
        :alt="cta?.alt"
        class="relative z-10 w-full rounded-lg"
      />
    </UPageCTA>
  </UPageSection>
</template>
