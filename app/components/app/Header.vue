<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui'
  import type { ActivityType } from '~/composables/useActivities'

  const appConfig = useAppConfig()

  const { socials, getSocialIcon } = useSocials()
  const { getIcon } = useEventIcon()

  const activityCssVar: Record<string, string> = {
    oa: 'var(--color-efreipara-oa)',
    tandem: 'var(--color-efreipara-tandem)',
    soufflerie: 'var(--color-efreipara-soufflerie)',
    pac: 'var(--color-efreipara-pac)',
  }

  const hoveredMenuItem = ref<string | null>(null)
  const activityMenuItemStyle = (slot: string) =>
    hoveredMenuItem.value === slot
      ? {
          backgroundColor: `color-mix(in oklch, ${activityCssVar[slot]} 12%, transparent)`,
          transition: 'background-color 0.2s',
        }
      : { transition: 'background-color 0.2s' }

  const hoveredMobileCard = ref<string | null>(null)
  const mobileCardStyle = (slot: string) => ({
    transition: 'background-color 0.2s',
    ...(hoveredMobileCard.value === slot
      ? { backgroundColor: `color-mix(in oklch, ${activityCssVar[slot]} 12%, transparent)` }
      : {}),
  })
  const mobileCardIconStyle = (slot: string) => ({
    backgroundColor: `color-mix(in oklch, ${activityCssVar[slot]} 15%, transparent)`,
  })

  const { features, toggle, hasActiveFeature } = useAccessibility()

  const accessibilityItems = computed(() => [
    [
      {
        label: 'Police dyslexique',
        icon: 'tabler:typography',
        type: 'checkbox' as const,
        checked: features.value.dyslexic,
        onUpdateChecked: () => toggle('dyslexic'),
        onSelect: (e: Event) => e.preventDefault(),
        class: 'cursor-pointer font-open-dyslexic',
      },
      {
        label: 'Contraste élevé',
        icon: 'tabler:contrast',
        type: 'checkbox' as const,
        checked: features.value.highContrast,
        onUpdateChecked: () => toggle('highContrast'),
        onSelect: (e: Event) => e.preventDefault(),
        class: 'cursor-pointer',
      },
    ],
  ])
  const discord = socials.find((s) => s.name.toLowerCase() === 'discord')
  const instagram = socials.find((s) => s.name.toLowerCase() === 'instagram')

  const activities = [
    {
      slot: 'oa',
      label: 'Saut en OA',
      description: 'Saut solo en ouverture automatique',
      to: '/activites/oa',
    },
    {
      slot: 'tandem',
      label: 'Saut en Tandem',
      description: 'Découverte avec un moniteur',
      to: '/activites/tandem',
    },
    {
      slot: 'soufflerie',
      label: 'Soufflerie',
      description: 'Chute libre en tunnel de vent',
      to: '/activites/soufflerie',
    },
    {
      slot: 'pac',
      label: 'PAC',
      description: 'Progression Accompagnée en Chute',
      to: '/activites/pac',
    },
  ]

  const otherLinks = [
    {
      label: 'Documents',
      to: '/documents',
      icon: appConfig.efreipara.icons.navigation.document,
    },
    {
      label: 'Galerie',
      to: '/galerie',
      icon: appConfig.efreipara.icons.navigation.galerie,
    },
    {
      label: 'Nous rejoindre',
      to: '/rejoindre',
      icon: appConfig.efreipara.icons.rejoindre.rejoindre,
    },
  ]

  const baseItems = [
    {
      label: 'Nos activités',
      to: '/activites',
      icon: getIcon('oa'),
      defaultOpen: true,
      slot: 'activities',
      children: activities.map((a) => ({
        label: a.label,
        description: a.description,
        to: a.to,
        slot: a.slot,
      })),
    },
    ...otherLinks,
  ]

  const itemsDesktop = computed<NavigationMenuItem[]>(() => [...baseItems])
</script>

<template>
  <UHeader>
    <template #title>
      <Icon name="efreipara:logo" class="text-efreipara ml-2 h-12 w-32 dark:hidden" />
      <Icon name="efreipara:logo-color" class="ml-2 hidden h-12 w-32 dark:block" />
    </template>

    <!-- Desktop : navigation + actions -->
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
        <template #activities-content="{ item }">
          <div class="grid grid-cols-2 gap-1 p-2">
            <ULink
              v-for="child in (item as any).children"
              :key="child.label"
              :to="child.to"
              class="group flex items-start gap-2 rounded-md p-3"
              :style="activityMenuItemStyle(child.slot)"
              @mouseenter="hoveredMenuItem = child.slot"
              @mouseleave="hoveredMenuItem = null"
            >
              <div
                class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg"
                :style="mobileCardIconStyle(child.slot)"
              >
                <Icon
                  :name="getIcon(child.slot as ActivityType)"
                  :style="{ color: activityCssVar[child.slot] }"
                  class="size-4"
                />
              </div>
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

      <!-- Réseaux sociaux, accessibilité, mode sombre -->
      <div class="hidden items-center gap-1 lg:flex">
        <span aria-hidden="true" class="bg-accented h-4 w-px" />
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
        <span aria-hidden="true" class="bg-accented h-4 w-px" />
        <UDropdownMenu :items="accessibilityItems">
          <UButton
            :icon="
              hasActiveFeature
                ? appConfig.ui.icons.accessibilityFilled
                : appConfig.ui.icons.accessibility
            "
            color="neutral"
            :variant="hasActiveFeature ? 'solid' : 'ghost'"
            aria-label="Options d'accessibilité"
            class="cursor-pointer rounded-full p-2"
          />
        </UDropdownMenu>
        <HeaderColorModeButton class="cursor-pointer rounded-full p-2" />
      </div>
    </template>

    <!-- Mobile : accessibilité, mode sombre, burger -->
    <template #toggle="{ open, toggle: toggleMenu }">
      <div class="flex items-center gap-1 lg:hidden">
        <UDropdownMenu :items="accessibilityItems">
          <UButton
            :icon="
              hasActiveFeature
                ? appConfig.ui.icons.accessibilityFilled
                : appConfig.ui.icons.accessibility
            "
            color="neutral"
            :variant="hasActiveFeature ? 'solid' : 'ghost'"
            aria-label="Options d'accessibilité"
            class="cursor-pointer rounded-full p-2"
          />
        </UDropdownMenu>
        <HeaderColorModeButton class="cursor-pointer rounded-full p-2" />
        <span aria-hidden="true" class="bg-accented h-4 w-px" />
        <HeaderBurgerButton :open="open" @click="toggleMenu" />
      </div>
    </template>

    <!-- Mobile : menu de navigation -->
    <template #body>
      <div class="flex flex-col">
        <!-- Activités -->
        <NuxtLink
          to="/activites"
          class="text-toned hover:text-highlighted hover:bg-elevated/50 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors"
        >
          <Icon :name="getIcon('oa')" class="text-muted size-5 shrink-0" />
          <span class="flex-1 text-sm font-medium">Nos activités</span>
          <Icon name="tabler:chevron-right" class="text-muted size-4 shrink-0" />
        </NuxtLink>
        <div class="border-default mb-1 ml-4 border-l pl-2">
          <NuxtLink
            v-for="activity in activities"
            :key="activity.slot"
            :to="activity.to"
            class="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors"
            :style="mobileCardStyle(activity.slot)"
            @mouseenter="hoveredMobileCard = activity.slot"
            @mouseleave="hoveredMobileCard = null"
          >
            <div
              class="flex size-7 shrink-0 items-center justify-center rounded-lg"
              :style="mobileCardIconStyle(activity.slot)"
            >
              <Icon
                :name="getIcon(activity.slot as ActivityType)"
                :style="{ color: activityCssVar[activity.slot] }"
                class="size-3.5"
              />
            </div>
            <span class="flex-1 text-sm font-medium">{{ activity.label }}</span>
            <Icon name="tabler:chevron-right" class="text-muted size-4 shrink-0" />
          </NuxtLink>
        </div>

        <!-- Autres pages -->
        <div>
          <NuxtLink
            v-for="link in otherLinks"
            :key="link.label"
            :to="link.to"
            class="text-toned hover:text-highlighted hover:bg-elevated/50 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors"
          >
            <Icon :name="link.icon" class="text-muted size-5 shrink-0" />
            <span class="flex-1 text-sm font-medium">{{ link.label }}</span>
            <Icon name="tabler:chevron-right" class="text-muted size-4 shrink-0" />
          </NuxtLink>
        </div>

        <!-- Réseaux sociaux -->
        <div class="border-default mt-2 flex items-center gap-1 border-t pt-2">
          <UButton
            v-for="social in socials"
            :key="social.name"
            :to="social.url"
            target="_blank"
            :icon="social.icon"
            :aria-label="`${social.name} Efrei Para`"
            color="neutral"
            variant="ghost"
            class="rounded-full p-2"
          />
        </div>
      </div>
    </template>
  </UHeader>
</template>
