<script setup lang="ts">
  const { club, socials, maps, getSocial } = await useClub()

  const { t } = await useT('contact')
  const mapKeys = ['google', 'apple', 'waze'] as const
</script>

<template>
  <div>
    <SharedPageHero
      :headline="t.hero.headline"
      :title="t.hero.title"
      :description="t.hero.description"
    />

    <UContainer class="py-12 sm:py-16">
      <div class="grid gap-6 md:grid-cols-2">
        <UCard
          variant="subtle"
          class="rounded-2xl"
          :ui="{ body: 'flex h-full flex-col p-6 sm:p-8' }"
        >
          <SharedHeadline as="h2" :icon="t.email.icon" class="mb-4">
            {{ t.email.title }}
          </SharedHeadline>
          <p class="font-title text-highlighted text-xl break-all select-text sm:text-2xl">
            {{ club.email }}
          </p>
          <p class="text-muted mt-2 mb-6 flex-1 text-sm">{{ t.email.description }}</p>
          <UButton
            :to="`mailto:${club.email}`"
            :icon="t.email.icon"
            :label="t.email.buttonLabel"
            variant="primary"
            class="self-start"
          />
        </UCard>

        <UCard
          variant="subtle"
          class="rounded-2xl"
          :ui="{ body: 'flex h-full flex-col p-6 sm:p-8' }"
        >
          <SharedHeadline as="h2" :icon="t.socials.icon" class="mb-4">
            {{ t.socials.title }}
          </SharedHeadline>
          <p class="text-muted mb-6 text-sm">{{ t.socials.description }}</p>
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="social in socials"
              :key="social.name"
              :to="social.url"
              target="_blank"
              :icon="social.icon"
              variant="secondary"
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
          <SharedHeadline as="h2" :icon="t.address.icon" class="mb-4">
            {{ t.address.title }}
          </SharedHeadline>
          <p class="font-title text-highlighted text-xl select-text">{{ club.address }}</p>
          <p class="text-muted mt-2 mb-6 flex-1 text-sm">{{ t.address.description }}</p>
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="map in mapKeys"
              :key="map"
              :to="maps[map]"
              target="_blank"
              :icon="t.address.buttons[map].icon"
              size="sm"
              variant="utility"
            >
              {{ t.address.buttons[map].label }}
            </UButton>
          </div>
        </UCard>

        <UCard
          variant="subtle"
          class="rounded-2xl"
          :ui="{ body: 'flex h-full flex-col p-6 sm:p-8' }"
        >
          <SharedHeadline as="h2" :icon="t.support.icon" class="mb-4">
            {{ t.support.title }}
          </SharedHeadline>
          <p class="text-muted mb-6 flex-1 text-sm">{{ t.support.description }}</p>
          <div class="flex flex-wrap gap-2">
            <UButton
              :to="club.github.issues"
              :icon="getSocial('github')?.icon"
              size="sm"
              variant="utility"
            >
              {{ t.support.buttons.github }}
            </UButton>
            <UButton
              :to="`mailto:${club.maintainerEmail}`"
              :icon="t.support.icon"
              size="sm"
              variant="utility"
            >
              {{ t.support.buttons.email }}
            </UButton>
          </div>
        </UCard>
      </div>
    </UContainer>

    <SharedCallToAction />
  </div>
</template>
