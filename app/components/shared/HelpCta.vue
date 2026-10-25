<script setup lang="ts">
  const props = defineProps<{
    title: string
    description: string
    icon: string
    buttons: ('discord' | 'instagram' | 'github')[]
  }>()

  const { club, getSocial } = await useClub()
  const { labels } = await useLabels()
  const socialButtons = computed(() =>
    (['discord', 'instagram'] as const)
      .filter((key) => props.buttons.includes(key))
      .map((key) => getSocial(key))
      .filter((social) => !!social),
  )
</script>

<template>
  <UCard class="mt-12">
    <div class="space-y-6 text-center">
      <div class="space-y-3">
        <div class="flex justify-center">
          <UIcon :name="icon" class="text-primary size-12" />
        </div>
        <h2 class="text-2xl font-bold">{{ title }}</h2>
        <p class="text-muted mx-auto max-w-xl">{{ description }}</p>
      </div>
      <div class="flex flex-wrap justify-center gap-3">
        <UButton
          v-for="social in socialButtons"
          :key="social.key"
          :to="social.url"
          target="_blank"
          size="lg"
          :icon="social.icon"
          color="primary"
          class="rounded-full"
        >
          {{ social.name }}
        </UButton>
        <UButton
          v-if="buttons.includes('github')"
          :to="club.github.issues"
          target="_blank"
          size="lg"
          :icon="getSocial('github')?.icon"
          color="primary"
          variant="subtle"
          class="rounded-full"
        >
          {{ labels.helpCta.github }}
        </UButton>
      </div>
    </div>
  </UCard>
</template>
