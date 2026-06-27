<script setup lang="ts">
  const { socials } = useSocials()
  const appConfig = useAppConfig()
  const contact = appConfig.contact

  const { data: page } = await useAsyncData('contact', () => queryCollection('contact').first())
</script>

<template>
  <div>
    <PageHero :title="page?.hero.title" :description="page?.hero.description" />

    <UContainer class="pb-16">
      <!-- Email - carte principale mise en avant -->
      <UCard variant="subtle" class="mb-10">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-4">
            <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <UIcon :name="appConfig.efreipara.icons.contact.email" class="size-6 text-primary" />
            </div>
            <div>
              <h2 class="text-lg font-bold">{{ page?.email.title }}</h2>
              <p class="text-sm text-muted">{{ contact.email }}</p>
            </div>
          </div>
          <UButton
            :to="contact.url"
            :icon="appConfig.efreipara.icons.contact.email"
            color="primary"
            class="shrink-0 rounded-full"
          >
            {{ page?.email.buttonLabel }}
          </UButton>
        </div>
      </UCard>

      <!-- Réseaux sociaux -->
      <div class="mb-10">
        <div class="mb-6">
          <h2 class="text-lg font-bold">{{ page?.socials.title }}</h2>
          <p class="text-sm text-muted">{{ page?.socials.description }}</p>
        </div>
        <div class="flex flex-wrap justify-center gap-3">
          <NuxtLink
            v-for="social in socials"
            :key="social.name"
            :to="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3.5 transition-colors hover:bg-muted"
          >
            <UIcon :name="social.icon" class="size-5 shrink-0" />
            <span class="truncate text-sm font-semibold">{{ social.name }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Adresse + Support -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- Adresse -->
        <UCard variant="subtle">
          <div class="mb-4 flex items-center gap-3">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-efreipara-oa/10"
            >
              <UIcon
                :name="appConfig.efreipara.icons.contact.mapPin"
                class="size-5 text-efreipara-oa"
              />
            </div>
            <div>
              <h2 class="font-bold">{{ page?.address.title }}</h2>
              <p class="text-xs text-muted">{{ page?.address.description }}</p>
            </div>
          </div>
          <p class="mb-4 text-sm text-muted">{{ contact.address }}</p>
          <div class="flex flex-wrap gap-2">
            <UButton
              :to="contact.mapUrls.google"
              target="_blank"
              :icon="appConfig.efreipara.icons.contact.googleMaps"
              size="sm"
              color="neutral"
              class="rounded-full"
            >
              {{ page?.address.buttons.google }}
            </UButton>
            <UButton
              :to="contact.mapUrls.apple"
              target="_blank"
              :icon="appConfig.efreipara.icons.contact.apple"
              size="sm"
              color="neutral"
              class="rounded-full"
            >
              {{ page?.address.buttons.apple }}
            </UButton>
            <UButton
              :to="contact.mapUrls.waze"
              target="_blank"
              :icon="appConfig.efreipara.icons.contact.waze"
              size="sm"
              color="neutral"
              class="rounded-full"
            >
              {{ page?.address.buttons.waze }}
            </UButton>
          </div>
        </UCard>

        <!-- Support technique -->
        <UCard variant="subtle">
          <div class="mb-4 flex items-center gap-3">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-efreipara-pac/10"
            >
              <UIcon
                :name="appConfig.efreipara.icons.contact.support"
                class="size-5 text-efreipara-pac"
              />
            </div>
            <div>
              <h2 class="font-bold">{{ page?.support.title }}</h2>
              <p class="text-xs text-muted">{{ page?.support.description }}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <UButton
              to="https://github.com/efreipara/efreipara/issues/new"
              :icon="appConfig.socials.github.icon"
              size="sm"
              color="neutral"
              class="rounded-full"
            >
              {{ page?.support.buttons.github }}
            </UButton>
            <UButton
              :to="contact.maintainer.url"
              :icon="appConfig.efreipara.icons.contact.support"
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

    <CallToAction />
  </div>
</template>
