<script setup lang="ts">
  const { club, socials, maps, getSocial } = await useClub()

  const { data: page } = await useAsyncData('contact', () => queryCollection('contact').first())
  const mapKeys = ['google', 'apple', 'waze'] as const
</script>

<template>
  <div>
    <SharedPageHero
      :headline="page?.hero.headline"
      :title="page?.hero.title"
      :description="page?.hero.description"
    />

    <UContainer class="py-12 sm:py-16">
      <div class="grid gap-6 md:grid-cols-2">
        <UCard
          variant="subtle"
          class="rounded-2xl"
          :ui="{ body: 'flex h-full flex-col p-6 sm:p-8' }"
        >
          <SharedHeadline as="h2" :icon="page?.email.icon" class="mb-4">
            {{ page?.email.title }}
          </SharedHeadline>
          <p class="font-title text-highlighted text-xl break-all sm:text-2xl">{{ club.email }}</p>
          <p class="text-muted mt-2 mb-6 flex-1 text-sm">{{ page?.email.description }}</p>
          <UButton
            :to="`mailto:${club.email}`"
            :icon="page?.email.icon"
            color="primary"
            class="self-start rounded-full"
          >
            {{ page?.email.buttonLabel }}
          </UButton>
        </UCard>

        <UCard
          variant="subtle"
          class="rounded-2xl"
          :ui="{ body: 'flex h-full flex-col p-6 sm:p-8' }"
        >
          <SharedHeadline as="h2" :icon="page?.socials.icon" class="mb-4">
            {{ page?.socials.title }}
          </SharedHeadline>
          <p class="text-muted mb-6 text-sm">{{ page?.socials.description }}</p>
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="social in socials"
              :key="social.name"
              :to="social.url"
              target="_blank"
              :icon="social.icon"
              color="neutral"
              variant="subtle"
              class="rounded-full"
            >
              {{ social.name }}
            </UButton>
          </div>
        </UCard>

        <UCard
          variant="subtle"
          class="rounded-2xl"
          :ui="{ body: 'flex h-full flex-col p-6 sm:p-8' }"
        >
          <SharedHeadline as="h2" :icon="page?.address.icon" class="mb-4">
            {{ page?.address.title }}
          </SharedHeadline>
          <p class="font-title text-highlighted text-xl">{{ club.address }}</p>
          <p class="text-muted mt-2 mb-6 flex-1 text-sm">{{ page?.address.description }}</p>
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="map in mapKeys"
              :key="map"
              :to="maps[map]"
              target="_blank"
              :icon="page?.address.buttons[map].icon"
              size="sm"
              color="neutral"
              class="rounded-full"
            >
              {{ page?.address.buttons[map].label }}
            </UButton>
          </div>
        </UCard>

        <UCard
          variant="subtle"
          class="rounded-2xl"
          :ui="{ body: 'flex h-full flex-col p-6 sm:p-8' }"
        >
          <SharedHeadline as="h2" :icon="page?.support.icon" class="mb-4">
            {{ page?.support.title }}
          </SharedHeadline>
          <p class="text-muted mb-6 flex-1 text-sm">{{ page?.support.description }}</p>
          <div class="flex flex-wrap gap-2">
            <UButton
              :to="club.github.issues"
              :icon="getSocial('github')?.icon"
              size="sm"
              color="neutral"
              class="rounded-full"
            >
              {{ page?.support.buttons.github }}
            </UButton>
            <UButton
              :to="`mailto:${club.maintainerEmail}`"
              :icon="page?.support.icon"
              size="sm"
              color="neutral"
              class="rounded-full"
            >
              {{ page?.support.buttons.email }}
            </UButton>
          </div>
        </UCard>
      </div>
    </UContainer>

    <SharedCallToAction />
  </div>
</template>
