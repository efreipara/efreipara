<script setup lang="ts">
  import type { ButtonProps } from '@nuxt/ui'

  const props = defineProps<{
    title: string
    description: string
    icon: string
    buttons: ('discord' | 'instagram' | 'github')[]
  }>()

  const { club, getSocial } = await useClub()
  const { labels } = await useLabels()

  const links = computed<ButtonProps[]>(() =>
    props.buttons
      .flatMap((key): ButtonProps[] => {
        const social = getSocial(key)
        if (!social) return []
        return key === 'github'
          ? [
              {
                label: labels.value.helpCta.github,
                to: club.value.github.issues,
                icon: social.icon,
                variant: 'subtle',
              },
            ]
          : [{ label: social.name, to: social.url, icon: social.icon }]
      })
      .map((link) => ({ ...link, target: '_blank', size: 'lg', class: 'rounded-full' })),
  )
</script>

<template>
  <UPageCTA
    :description="description"
    :links="links"
    variant="subtle"
    class="mt-16 rounded-2xl"
    :ui="{
      container: 'px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-12',
      title: 'font-title flex items-center gap-3 text-left text-2xl tracking-normal sm:text-3xl',
      description: 'mt-3 max-w-2xl text-left',
      links: 'justify-start',
    }"
  >
    <template #title>
      <UIcon :name="icon" class="text-primary size-7 shrink-0" />
      {{ title }}
    </template>
  </UPageCTA>
</template>
