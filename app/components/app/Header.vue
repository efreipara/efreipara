<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui'

  const { socials, getSocial } = await useClub()
  const { getIcon } = await useActivities()
  const {
    accessibility,
    accessibilityMenu,
    activitiesIndex,
    activities,
    headerLinks,
    menuButton,
    colorModeButton,
  } = await useNavigation()
  const { labels } = await useLabels()

  const { features, toggle, hasActiveFeature } = useAccessibility()

  type AccessibilityKey = Parameters<typeof toggle>[0]
  const accessibilityClass: Record<string, string> = {
    dyslexic: 'cursor-pointer font-open-dyslexic',
    highContrast: 'cursor-pointer',
  }

  const accessibilityItems = computed(() => [
    accessibility.value.map((item) => ({
      label: item.label,
      icon: item.icon,
      type: 'checkbox' as const,
      checked: features.value[item.key as AccessibilityKey],
      onUpdateChecked: () => toggle(item.key as AccessibilityKey),
      onSelect: (e: Event) => e.preventDefault(),
      class: accessibilityClass[item.key] ?? 'cursor-pointer',
    })),
  ])
  const discord = computed(() => getSocial('discord'))
  const instagram = computed(() => getSocial('instagram'))

  const baseItems = computed<NavigationMenuItem[]>(() => [
    {
      label: activitiesIndex.value.label,
      to: activitiesIndex.value.to,
      icon: activitiesIndex.value.icon,
      defaultOpen: true,
      slot: 'activities',
      children: activities.value.map((a) => ({
        label: a.label,
        description: a.description,
        to: a.to,
        slot: a.slot,
      })),
    },
    ...headerLinks.value,
  ])

  const itemsDesktop = computed<NavigationMenuItem[]>(() => [...baseItems.value])
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
              class="group hover:bg-tint-12 flex items-start gap-2 rounded-md p-3 transition-colors duration-200"
              :class="activityClass(child.slot)"
            >
              <div
                class="bg-tint-15 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg"
              >
                <Icon :name="getIcon(child.slot)" class="text-activity size-4" />
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
          :icon="instagram.icon"
          :aria-label="fillLabel(labels.socialLink, { name: instagram.name })"
          color="neutral"
          variant="ghost"
          class="rounded-full p-2"
        />
        <UButton
          v-if="discord"
          :to="discord.url"
          target="_blank"
          :icon="discord.icon"
          :aria-label="fillLabel(labels.socialLink, { name: discord.name })"
          color="neutral"
          variant="ghost"
          class="rounded-full p-2"
        />
        <span aria-hidden="true" class="bg-accented h-4 w-px" />
        <UDropdownMenu :items="accessibilityItems">
          <UButton
            :icon="hasActiveFeature ? accessibilityMenu.activeIcon : accessibilityMenu.icon"
            color="neutral"
            :variant="hasActiveFeature ? 'solid' : 'ghost'"
            :aria-label="accessibilityMenu.label"
            class="cursor-pointer rounded-full p-2"
          />
        </UDropdownMenu>
        <HeaderColorModeButton :labels="colorModeButton" class="cursor-pointer rounded-full p-2" />
      </div>
    </template>

    <!-- Mobile : accessibilité, mode sombre, burger -->
    <template #toggle="{ open, toggle: toggleMenu }">
      <div class="flex items-center gap-1 lg:hidden">
        <UDropdownMenu :items="accessibilityItems">
          <UButton
            :icon="hasActiveFeature ? accessibilityMenu.activeIcon : accessibilityMenu.icon"
            color="neutral"
            :variant="hasActiveFeature ? 'solid' : 'ghost'"
            :aria-label="accessibilityMenu.label"
            class="cursor-pointer rounded-full p-2"
          />
        </UDropdownMenu>
        <HeaderColorModeButton :labels="colorModeButton" class="cursor-pointer rounded-full p-2" />
        <span aria-hidden="true" class="bg-accented h-4 w-px" />
        <HeaderBurgerButton :open="open" :labels="menuButton" @click="toggleMenu" />
      </div>
    </template>

    <!-- Mobile : menu de navigation -->
    <template #body>
      <div class="flex flex-col">
        <!-- Activités -->
        <NuxtLink
          :to="activitiesIndex.to"
          class="text-toned hover:text-highlighted hover:bg-elevated/50 aria-[current=page]:text-highlighted aria-[current=page]:bg-elevated/50 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors"
        >
          <Icon :name="activitiesIndex.icon" class="text-muted size-5 shrink-0" />
          <span class="flex-1 text-sm font-medium">{{ activitiesIndex.label }}</span>
          <Icon name="tabler:chevron-right" class="text-muted size-4 shrink-0" />
        </NuxtLink>
        <div class="border-default mb-1 ml-4 border-l pl-2">
          <NuxtLink
            v-for="activity in activities"
            :key="activity.slot"
            :to="activity.to"
            class="hover:bg-tint-12 aria-[current=page]:bg-tint-12 flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors duration-200"
            :class="activityClass(activity.slot)"
          >
            <div class="bg-tint-15 flex size-7 shrink-0 items-center justify-center rounded-lg">
              <Icon :name="getIcon(activity.slot)" class="text-activity size-3.5" />
            </div>
            <span class="flex-1 text-sm font-medium">{{ activity.label }}</span>
            <Icon name="tabler:chevron-right" class="text-muted size-4 shrink-0" />
          </NuxtLink>
        </div>

        <!-- Autres pages -->
        <div>
          <NuxtLink
            v-for="link in headerLinks"
            :key="link.label"
            :to="link.to"
            class="text-toned hover:text-highlighted hover:bg-elevated/50 aria-[current=page]:text-highlighted aria-[current=page]:bg-elevated/50 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors"
          >
            <Icon :name="link.icon ?? ''" class="text-muted size-5 shrink-0" />
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
            :aria-label="fillLabel(labels.socialLink, { name: social.name })"
            color="neutral"
            variant="ghost"
            class="rounded-full p-2"
          />
        </div>
      </div>
    </template>
  </UHeader>
</template>
