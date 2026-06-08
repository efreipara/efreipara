<script setup lang="ts">
  /**
   * Page de contact d'Efrei Para
   * Affiche les différents moyens de contacter le club : email, adresse, réseaux sociaux
   */

  const { socials } = useSocials()
  const appConfig = useAppConfig()
  const contact = appConfig.contact

  // Moyens de contact principaux (email et adresse)
  const contactMethods = [
    {
      icon: appConfig.efreipara.icons.contact.email,
      title: 'Email',
      description: 'Envoie-nous un email pour toute question',
      value: contact.email,
      url: contact.url,
      color: 'text-efreipara-tandem',
    },
    {
      icon: appConfig.efreipara.icons.contact.mapPin,
      title: 'Adresse',
      description: 'Notre campus Efrei',
      value: contact.address,
      mapUrls: contact.mapUrls,
      color: 'text-efreipara-oa',
    },
  ]

  // Contact pour le support technique du site web
  const supportContact = {
    icon: appConfig.efreipara.icons.contact.support,
    title: 'Support Technique',
    description: 'Un problème avec le site ?',
    value: contact.maintainer.email,
    url: contact.maintainer.url,
    color: 'text-efreipara-pac',
  }
</script>

<template>
  <div>
    <!-- En-tête de la page -->
    <PageHero
      title="Nous contacter"
      description="Une question ? Une demande d'information ? N'hésite pas à nous contacter, nous te répondrons dans les plus brefs délais !"
    />

    <UContainer class="pb-16">
      <!-- Cartes des moyens de contact principaux (email et adresse) -->
      <div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <UCard v-for="method in contactMethods" :key="method.title" variant="subtle">
          <template #header>
            <div class="flex items-start gap-3">
              <div class="shrink-0 p-2">
                <UIcon :name="method.icon" :class="['size-6', method.color]" />
              </div>
              <div class="min-w-0 flex-1">
                <h2 class="mb-1 text-xl font-bold">{{ method.title }}</h2>
                <p class="text-sm text-gray-400">{{ method.description }}</p>
              </div>
            </div>
          </template>

          <!-- Contenu pour l'email avec bouton d'action -->
          <div v-if="method.url && !method.mapUrls" class="space-y-3">
            <p class="text-sm text-gray-300">{{ method.value }}</p>
            <UButton
              :to="method.url"
              :icon="method.icon"
              size="sm"
              block
              color="neutral"
              class="justify-center rounded-full"
            >
              Envoyer un email
            </UButton>
          </div>

          <!-- Contenu pour l'adresse avec liens vers applications de cartographie -->
          <div v-else-if="method.mapUrls" class="space-y-3">
            <p class="text-sm text-gray-300">{{ method.value }}</p>
            <div class="grid grid-cols-3 gap-2">
              <UButton
                :to="method.mapUrls.google"
                target="_blank"
                :icon="appConfig.efreipara.icons.contact.googleMaps"
                size="sm"
                color="neutral"
                title="Google Maps"
                class="justify-center rounded-full"
              >
                <span class="hidden sm:inline">Google Maps</span>
                <span class="sm:hidden">Maps</span>
              </UButton>
              <UButton
                :to="method.mapUrls.apple"
                target="_blank"
                :icon="appConfig.efreipara.icons.contact.apple"
                size="sm"
                color="neutral"
                title="Apple Plans"
                class="justify-center rounded-full"
              >
                <span class="hidden sm:inline">Apple Plans</span>
                <span class="sm:hidden">Plans</span>
              </UButton>
              <UButton
                :to="method.mapUrls.waze"
                target="_blank"
                :icon="appConfig.efreipara.icons.contact.waze"
                size="sm"
                color="neutral"
                title="Waze"
                class="justify-center rounded-full"
              >
                Waze
              </UButton>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Carte des réseaux sociaux avec liens vers chaque plateforme -->
      <UCard variant="subtle" class="mb-6">
        <template #header>
          <div class="flex items-start gap-3">
            <div class="shrink-0 p-2">
              <UIcon
                :name="appConfig.efreipara.icons.contact.socialNetworks"
                class="text-efreipara-soufflerie size-6"
              />
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="mb-1 text-xl font-bold">Réseaux sociaux</h2>
              <p class="text-sm text-gray-400">Suis-nous sur nos différents réseaux sociaux</p>
            </div>
          </div>
        </template>

        <!-- Grille des cartes de réseaux sociaux -->
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          <NuxtLink
            v-for="social in socials"
            :key="social.name"
            :to="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group block"
          >
            <UCard
              class="hover:bg-primary-800 h-full cursor-pointer transition-colors duration-200"
            >
              <div class="flex flex-col items-center gap-2 text-center">
                <UIcon :name="social.icon" class="size-6 text-gray-400" />
                <span class="text-sm font-semibold">{{ social.name }}</span>
              </div>
            </UCard>
          </NuxtLink>
        </div>
      </UCard>

      <!-- Carte de support technique pour signaler des problèmes sur le site -->
      <UCard variant="subtle" class="mb-12">
        <template #header>
          <div class="flex items-start gap-3">
            <div class="shrink-0 p-2">
              <UIcon :name="supportContact.icon" :class="['size-6', supportContact.color]" />
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="mb-1 text-xl font-bold">{{ supportContact.title }}</h2>
              <p class="text-sm text-gray-400">
                {{ supportContact.description }}
              </p>
            </div>
          </div>
        </template>

        <!-- Boutons pour signaler un problème (GitHub ou email) -->
        <div class="flex flex-col gap-3 sm:flex-row">
          <UButton
            to="https://github.com/efreipara/efreipara/issues/new"
            :icon="appConfig.socials.github.icon"
            size="sm"
            color="neutral"
            class="justify-center rounded-full"
          >
            Signaler sur GitHub
          </UButton>
          <UButton
            :to="supportContact.url"
            :icon="supportContact.icon"
            size="sm"
            color="neutral"
            class="justify-center rounded-full"
          >
            Contacter par email
          </UButton>
        </div>
      </UCard>
    </UContainer>
    <CallToAction />
  </div>
</template>
