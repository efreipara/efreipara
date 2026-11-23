<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui'

  const appConfig = useAppConfig()
  const { socials, getSocial } = await useClub()
  const { getIcon } = await useActivities()
  const {
    logo,
    headerSocials,
    accessibility,
    accessibilityMenu,
    activitiesIndex,
    activities,
    headerLinks,
    menuButton,
    colorModeButton,
  } = await useNavigation()
  const { labels } = await useLabels()

  const { season } = await useSeason()
  const { features, toggle } = useAccessibility()

  type AccessibilityKey = Parameters<typeof toggle>[0]
  const accessibilityClass: Record<string, string> = {
    dyslexic: 'cursor-pointer font-open-dyslexic',
  }

  // Les décorations de saison ne se proposent que pendant une saison, avec son icône
  const shownAccessibility = computed(() =>
    accessibility.value
      .filter((item) => item.key !== 'seasonal' || season.value)
      .map((item) => ({
        ...item,
        key: item.key as AccessibilityKey,
        icon: item.key === 'seasonal' ? (season.value?.icon ?? item.icon) : item.icon,
      })),
  )

  const isMenuAdjusted = computed(() =>
    shownAccessibility.value.some((item) => isAdjusted(features.value, item.key)),
  )

  const accessibilityItems = computed(() => [
    shownAccessibility.value.map((item) => ({
      label: item.label,
      icon: item.icon,
      type: 'checkbox' as const,
      checked: features.value[item.key],
      onUpdateChecked: () => toggle(item.key),
      onSelect: (e: Event) => e.preventDefault(),
      class: accessibilityClass[item.key] ?? 'cursor-pointer',
    })),
  ])

  const desktopSocials = computed(() =>
    headerSocials.value.map((key) => getSocial(key)).filter((social) => !!social),
  )

  // Fenêtre du menu mobile, téléportée hors du <header> : même zone Plausible (utils/goals.ts)
  const menuContentAttrs = computed<Record<string, string>>(() => ({
    'data-goal-zone': labels.value.goalZones.header,
  }))

  // Le sous-menu des activités est rendu par le slot #activities-content
  const items = computed<NavigationMenuItem[]>(() => [
    {
      label: activitiesIndex.value.label,
      to: activitiesIndex.value.to,
      icon: activitiesIndex.value.icon,
      slot: 'activities',
      children: activities.value.map((a) => ({ label: a.label, to: a.to })),
    },
    ...headerLinks.value,
  ])
</script>

<template>
  <UHeader
    :title="logo.label"
    :ui="{ title: 'transition active:scale-[0.97]' }"
    :data-goal-zone="labels.goalZones.header"
    :menu="{ content: menuContentAttrs }"
  >
    <template #title>
      <Icon name="efreipara:logo" class="text-efreipara ml-2 h-12 w-32 dark:hidden" />
      <Icon name="efreipara:logo-color" class="ml-2 hidden h-12 w-32 dark:block" />
    </template>

    <!-- Desktop : navigation centrée -->
    <UNavigationMenu
      :items="items"
      :ui="{
        link: 'text-toned hover:text-highlighted data-[active=true]:text-highlighted transition active:scale-[0.97]',
        linkLabel:
          'text-toned group-hover:text-highlighted group-data-[active=true]:text-highlighted',
        linkLeadingIcon: 'text-toned',
        childLinkLabel:
          'text-toned group-hover:text-highlighted group-data-[active=true]:text-highlighted',
      }"
    >
      <template #activities-content>
        <div class="grid grid-cols-2 gap-1 p-2" :data-goal-zone="labels.goalZones.header">
          <ULink
            v-for="activity in activities"
            :key="activity.slot"
            :to="activity.to"
            class="group hover:bg-tint-12 flex items-start gap-2 rounded-md p-3 transition duration-200 active:scale-[0.98]"
            :class="activityClass(activity.slot)"
          >
            <div
              class="bg-tint-15 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg"
            >
              <Icon :name="getIcon(activity.slot)" class="text-activity size-4" />
            </div>
            <div class="min-w-0 flex-1">
              <p
                class="text-toned group-hover:text-highlighted text-sm font-medium transition-colors"
                data-goal-title
              >
                {{ activity.label }}
              </p>
              <p class="text-muted line-clamp-2 text-sm">
                {{ activity.description }}
              </p>
            </div>
          </ULink>
        </div>
      </template>
    </UNavigationMenu>

    <!-- Réseaux (desktop), accessibilité et mode sombre (toutes tailles) -->
    <template #right>
      <div class="hidden items-center gap-1 lg:flex">
        <UButton
          v-for="social in desktopSocials"
          :key="social.key"
          :to="social.url"
          target="_blank"
          :icon="social.icon"
          :aria-label="fillLabel(labels.socialLink, { name: social.name })"
          color="neutral"
          variant="ghost"
          class="p-2"
        />
        <span aria-hidden="true" class="bg-accented h-4 w-px" />
      </div>
      <UDropdownMenu :items="accessibilityItems">
        <UButton
          :icon="isMenuAdjusted ? accessibilityMenu.activeIcon : accessibilityMenu.icon"
          color="neutral"
          :variant="isMenuAdjusted ? 'solid' : 'ghost'"
          :aria-label="accessibilityMenu.label"
          class="p-2"
        />
      </UDropdownMenu>
      <HeaderColorModeButton :labels="colorModeButton" class="p-2" />
    </template>

    <!-- Mobile : burger -->
    <template #toggle="{ open, toggle: toggleMenu }">
      <div class="flex items-center gap-1 lg:hidden">
        <span aria-hidden="true" class="bg-accented h-4 w-px" />
        <HeaderBurgerButton :open="open" :labels="menuButton" @click="toggleMenu" />
      </div>
    </template>

    <!-- Mobile : menu de navigation -->
    <template #body>
      <div class="flex flex-col">
        <NuxtLink
          :to="activitiesIndex.to"
          class="text-toned hover:text-highlighted hover:bg-elevated/50 aria-[current=page]:text-highlighted aria-[current=page]:bg-elevated/50 flex items-center gap-3 rounded-lg px-2 py-2.5 transition active:scale-[0.98]"
        >
          <Icon :name="activitiesIndex.icon" class="text-muted size-5 shrink-0" />
          <span class="flex-1 text-sm font-medium">{{ activitiesIndex.label }}</span>
          <Icon :name="appConfig.ui.icons.chevronRight" class="text-muted size-4 shrink-0" />
        </NuxtLink>
        <div class="border-default mb-1 ml-4 border-l pl-2">
          <NuxtLink
            v-for="activity in activities"
            :key="activity.slot"
            :to="activity.to"
            class="hover:bg-tint-12 aria-[current=page]:bg-tint-12 flex items-center gap-2.5 rounded-lg px-2 py-2 transition duration-200 active:scale-[0.98]"
            :class="activityClass(activity.slot)"
          >
            <div class="bg-tint-15 flex size-7 shrink-0 items-center justify-center rounded-lg">
              <Icon :name="getIcon(activity.slot)" class="text-activity size-3.5" />
            </div>
            <span class="flex-1 text-sm font-medium">{{ activity.label }}</span>
            <Icon :name="appConfig.ui.icons.chevronRight" class="text-muted size-4 shrink-0" />
          </NuxtLink>
        </div>

        <div>
          <NuxtLink
            v-for="link in headerLinks"
            :key="link.label"
            :to="link.to"
            class="text-toned hover:text-highlighted hover:bg-elevated/50 aria-[current=page]:text-highlighted aria-[current=page]:bg-elevated/50 flex items-center gap-3 rounded-lg px-2 py-2.5 transition active:scale-[0.98]"
          >
            <Icon :name="link.icon ?? ''" class="text-muted size-5 shrink-0" />
            <span class="flex-1 text-sm font-medium">{{ link.label }}</span>
            <Icon :name="appConfig.ui.icons.chevronRight" class="text-muted size-4 shrink-0" />
          </NuxtLink>
        </div>

        <div class="border-default mt-2 flex items-center gap-1 border-t pt-2">
          <UButton
            v-for="social in socials"
            :key="social.key"
            :to="social.url"
            target="_blank"
            :icon="social.icon"
            :aria-label="fillLabel(labels.socialLink, { name: social.name })"
            color="neutral"
            variant="ghost"
            class="p-2"
          />
        </div>
      </div>
    </template>
  </UHeader>
</template>
