<script setup lang="ts">
  defineProps<{
    title: string
    description: string
    buttons: ('discord' | 'instagram' | 'github')[]
  }>()

  const { getSocialUrl, getSocialIcon } = useSocials()
  const appConfig = useAppConfig()
</script>

<template>
  <UCard class="mt-12">
    <div class="space-y-6 text-center">
      <div class="space-y-3">
        <div class="flex justify-center">
          <UIcon
            :name="appConfig.efreipara.icons.extras.question"
            class="text-primary-500 size-12"
          />
        </div>
        <h2 class="text-2xl font-bold">{{ title }}</h2>
        <p class="text-muted mx-auto max-w-xl">{{ description }}</p>
      </div>
      <div class="flex flex-wrap justify-center gap-3">
        <UButton
          v-if="buttons.includes('discord')"
          :to="getSocialUrl('Discord')"
          target="_blank"
          size="lg"
          :icon="getSocialIcon('Discord')"
          color="primary"
          class="rounded-full"
        >
          Discord
        </UButton>
        <UButton
          v-if="buttons.includes('instagram')"
          :to="getSocialUrl('Instagram')"
          target="_blank"
          size="lg"
          :icon="getSocialIcon('Instagram')"
          color="primary"
          class="rounded-full"
        >
          Instagram
        </UButton>
        <UButton
          v-if="buttons.includes('github')"
          :to="appConfig.socials.github.issues"
          target="_blank"
          size="lg"
          :icon="getSocialIcon('GitHub')"
          color="primary"
          variant="subtle"
          class="rounded-full"
        >
          Signaler sur GitHub
        </UButton>
      </div>
    </div>
  </UCard>
</template>
