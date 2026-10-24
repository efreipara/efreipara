<script setup lang="ts">
  defineProps<{
    title: string
    description: string
    icon: string
    buttons: ('discord' | 'instagram' | 'github')[]
  }>()

  const { club, getSocial } = await useClub()
  const { labels } = await useLabels()
  const discord = computed(() => getSocial('discord'))
  const instagram = computed(() => getSocial('instagram'))
</script>

<template>
  <UCard class="mt-12">
    <div class="space-y-6 text-center">
      <div class="space-y-3">
        <div class="flex justify-center">
          <UIcon :name="icon" class="text-primary-500 size-12" />
        </div>
        <h2 class="text-2xl font-bold">{{ title }}</h2>
        <p class="text-muted mx-auto max-w-xl">{{ description }}</p>
      </div>
      <div class="flex flex-wrap justify-center gap-3">
        <UButton
          v-if="buttons.includes('discord')"
          :to="discord?.url"
          target="_blank"
          size="lg"
          :icon="discord?.icon"
          color="primary"
          class="rounded-full"
        >
          {{ discord?.name }}
        </UButton>
        <UButton
          v-if="buttons.includes('instagram')"
          :to="instagram?.url"
          target="_blank"
          size="lg"
          :icon="instagram?.icon"
          color="primary"
          class="rounded-full"
        >
          {{ instagram?.name }}
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
