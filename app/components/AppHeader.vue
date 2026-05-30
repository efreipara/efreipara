<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui'
  import type { ActivityType } from '~/composables/useActivities'

  // Récupération des icônes depuis la configuration de l'app
  const appConfig = useAppConfig()

  // Récupération des données des réseaux sociaux et des fonctions utilitaires
  const { socials, getSocialIcon } = useSocials()
  const { getIcon } = useEventIcon()
  const { getColor } = useActivityColor()
  const discord = socials.find((s) => s.name.toLowerCase() === 'discord')
  const instagram = socials.find((s) => s.name.toLowerCase() === 'instagram')

  // Items de navigation partagés entre desktop et mobile
  const baseItems = [
    {
      label: 'Nos activités',
      to: '/activites',
      icon: getIcon('oa'),
      defaultOpen: true,
      slot: 'activities',
      children: [
        {
          label: 'Saut en OA',
          description: 'Saut solo en ouverture automatique',
          to: '/activites/oa',
          slot: 'oa',
        },
        {
          label: 'Saut en Tandem',
          description: 'Découverte du parachutisme avec un moniteur',
          to: '/activites/tandem',
          slot: 'tandem',
        },
        {
          label: 'Soufflerie',
          description: 'Expérience de chute libre en soufflerie',
          to: '/activites/soufflerie',
          slot: 'soufflerie',
        },
        {
          label: 'PAC',
          description: 'Progression Accompagnée en Chute',
          to: '/activites/pac',
          slot: 'pac',
        },
      ],
    },
    {
      label: 'Documents',
      to: '/documents',
      icon: appConfig.efreipara.icons.navigation.document,
    },
    {
      label: 'Galeries',
      to: '/galeries',
      icon: appConfig.efreipara.icons.navigation.galeries,
    },
    {
      label: 'Nous rejoindre',
      to: '/rejoindre',
      icon: appConfig.efreipara.icons.rejoindre.rejoindre,
    },
  ]

  // Menu desktop : sans les réseaux sociaux (rendus séparément en boutons ronds)
  const itemsDesktop = computed<NavigationMenuItem[]>(() => [...baseItems])

  // Menu mobile : avec labels pour les réseaux sociaux (meilleure accessibilité)
  const itemsMobile = computed<NavigationMenuItem[]>(() => [
    ...baseItems,
    {
      label: 'Instagram',
      icon: getSocialIcon('instagram'),
      to: instagram?.url,
      target: '_blank',
    },
    {
      label: 'Discord',
      icon: getSocialIcon('discord'),
      to: discord?.url,
      target: '_blank',
    },
  ])
</script>

<template>
  <UHeader>
    <!-- Logo Efrei Para -->
    <template #title>
      <Icon name="efreipara:logo-color" class="ml-2 h-12 w-32" />
    </template>

    <!-- Navigation desktop avec menu déroulant personnalisé pour les activités -->
    <template #right>
      <UNavigationMenu
        :items="itemsDesktop"
        class="hidden lg:flex"
        :ui="{
          link: 'text-toned hover:text-highlighted data-[active=true]:text-highlighted',
          linkLabel:
            'text-toned group-hover:text-highlighted group-data-[active=true]:text-highlighted',
          linkLeadingIcon: 'text-toned',
          childLinkLabel:
            'text-toned group-hover:text-highlighted group-data-[active=true]:text-highlighted',
        }"
      >
        <!-- Contenu personnalisé du menu "Nos activités" en grille 2 colonnes -->
        <template #activities-content="{ item }">
          <div class="grid grid-cols-2 gap-1 p-2">
            <ULink
              v-for="child in (item as any).children"
              :key="child.label"
              :to="child.to"
              class="group hover:bg-elevated/50 flex items-start gap-2 rounded-md p-3 transition-colors"
            >
              <Icon
                :name="getIcon(child.slot as ActivityType)"
                :class="`text-${getColor(child.slot as ActivityType)} size-5 shrink-0`"
              />
              <div class="min-w-0 flex-1">
                <p
                  class="text-toned group-hover:text-highlighted text-sm font-medium transition-colors"
                >
                  {{ child.label }}
                </p>
                <p class="text-muted line-clamp-2 text-sm">
                  {{ child.description }}
                </p>
              </div>
            </ULink>
          </div>
        </template>
      </UNavigationMenu>
      <div class="hidden items-center gap-1 lg:flex">
        <span class="text-muted">|</span>
        <UButton
          v-if="instagram"
          :to="instagram.url"
          target="_blank"
          :icon="getSocialIcon('instagram')"
          aria-label="Instagram Efrei Para"
          color="neutral"
          variant="ghost"
          class="rounded-full p-2"
        />
        <UButton
          v-if="discord"
          :to="discord.url"
          target="_blank"
          :icon="getSocialIcon('discord')"
          aria-label="Discord Efrei Para"
          color="neutral"
          variant="ghost"
          class="rounded-full p-2"
        />
        <span class="text-muted">|</span>
        <UColorModeButton class="rounded-full p-2" />
      </div>
    </template>

    <!-- Bouton burger animé vers croix -->
    <template #toggle="{ open, toggle }">
      <button
        class="relative size-8 lg:hidden"
        :aria-label="open ? 'Fermer le menu' : 'Ouvrir le menu'"
        @click="toggle"
      >
        <Icon
          :name="appConfig.ui.icons.menu"
          class="absolute inset-0 m-auto size-5 transition-all duration-300"
          :class="open ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'"
        />
        <Icon
          :name="appConfig.ui.icons.close"
          class="absolute inset-0 m-auto size-5 transition-all duration-300"
          :class="open ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'"
        />
      </button>
    </template>

    <!-- Navigation mobile avec icônes colorées pour chaque activité -->
    <template #body>
      <UNavigationMenu
        :items="itemsMobile"
        orientation="vertical"
        class="-mx-2.5"
        :ui="{
          link: 'text-toned hover:text-highlighted data-[active=true]:text-highlighted',
          linkLabel:
            'text-toned group-hover:text-highlighted group-data-[active=true]:text-highlighted',
          linkLeadingIcon: 'text-toned',
          childLinkLabel:
            'text-toned group-hover:text-highlighted group-data-[active=true]:text-highlighted',
        }"
      >
        <template #oa-leading>
          <Icon :name="getIcon('oa')" :class="`text-${getColor('oa')}`" />
        </template>
        <template #tandem-leading>
          <Icon :name="getIcon('tandem')" :class="`text-${getColor('tandem')}`" />
        </template>
        <template #soufflerie-leading>
          <Icon :name="getIcon('soufflerie')" :class="`text-${getColor('soufflerie')}`" />
        </template>
        <template #pac-leading>
          <Icon :name="getIcon('pac')" :class="`text-${getColor('pac')}`" />
        </template>
      </UNavigationMenu>
    </template>
  </UHeader>
</template>
