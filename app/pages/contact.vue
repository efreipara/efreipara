<script setup lang="ts">
/**
 * Page de contact d'Efrei Para
 * Affiche les différents moyens de contacter le club : email, adresse, réseaux sociaux
 */

// Récupération des données de contact et réseaux sociaux
const { contact } = useContact()
const { socials } = useSocials()

// Récupération des icônes depuis la configuration de l'app
const appConfig = useAppConfig()

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
    <UPageHero
      title="Nous contacter"
      description="Une question ? Une demande d'information ? N'hésite pas à nous contacter, nous te répondrons dans les plus brefs délais !"
      :ui="{ title: 'font-title' }"
    />

    <UContainer class="pb-16">
      <!-- Cartes des moyens de contact principaux (email et adresse) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <UCard v-for="method in contactMethods" :key="method.title" variant="subtle">
          <template #header>
            <div class="flex items-start gap-3">
              <div class="shrink-0 p-2">
                <UIcon :name="method.icon" :class="['size-6', method.color]" />
              </div>
              <div class="flex-1 min-w-0">
                <h2 class="text-xl font-bold mb-1">{{ method.title }}</h2>
                <p class="text-sm text-gray-400">{{ method.description }}</p>
              </div>
            </div>
          </template>

          <!-- Contenu pour l'email avec bouton d'action -->
          <div v-if="method.url && !method.mapUrls" class="space-y-3">
            <p class="text-gray-300 text-sm">{{ method.value }}</p>
            <UButton
              :to="method.url"
              :icon="method.icon"
              size="sm"
              block
              color="neutral"
              class="justify-center"
            >
              Envoyer un email
            </UButton>
          </div>

          <!-- Contenu pour l'adresse avec liens vers applications de cartographie -->
          <div v-else-if="method.mapUrls" class="space-y-3">
            <p class="text-gray-300 text-sm">{{ method.value }}</p>
            <div class="grid grid-cols-3 gap-2">
              <UButton
                :to="method.mapUrls.google"
                target="_blank"
                :icon="appConfig.efreipara.icons.contact.googleMaps"
                size="sm"
                color="neutral"
                title="Google Maps"
                class="justify-center"
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
                class="justify-center"
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
                class="justify-center"
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
                class="size-6 text-efreipara-soufflerie"
              />
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-xl font-bold mb-1">Réseaux sociaux</h2>
              <p class="text-sm text-gray-400">Suis-nous sur nos différents réseaux sociaux</p>
            </div>
          </div>
        </template>

        <!-- Grille des cartes de réseaux sociaux -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <NuxtLink
            v-for="social in socials"
            :key="social.name"
            :to="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="block group"
          >
            <UCard
              class="cursor-pointer hover:bg-primary-800 transition-colors duration-200 h-full"
            >
              <div class="flex flex-col items-center gap-2 text-center">
                <UIcon :name="social.icon" class="size-6 text-gray-400" />
                <span class="font-semibold text-sm">{{ social.name }}</span>
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
            <div class="flex-1 min-w-0">
              <h2 class="text-xl font-bold mb-1">{{ supportContact.title }}</h2>
              <p class="text-sm text-gray-400">
                {{ supportContact.description }}
              </p>
            </div>
          </div>
        </template>

        <!-- Boutons pour signaler un problème (GitHub ou email) -->
        <div class="flex flex-col sm:flex-row gap-3">
          <UButton
            to="https://github.com/efreipara/efreipara/issues/new"
            :icon="appConfig.socials.github.icon"
            size="sm"
            color="neutral"
            class="justify-center"
          >
            Signaler sur GitHub
          </UButton>
          <UButton
            :to="supportContact.url"
            :icon="supportContact.icon"
            size="sm"
            color="neutral"
            class="justify-center"
          >
            Contacter par email
          </UButton>
        </div>
      </UCard>
    </UContainer>
    <CallToAction />
  </div>
</template>
