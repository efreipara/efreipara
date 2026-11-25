export const useNavigation = async () => {
  // Lancées ensemble : un composable appelé après un await perd le contexte Nuxt
  const [{ data }, { activities: activityList }] = await Promise.all([
    useContentData('navigation'),
    useActivities(),
  ])

  const logo = computed(() => data.value!.logo)
  const headerSocials = computed(() => data.value?.headerSocials ?? [])
  const accessibility = computed(() => data.value!.accessibility)
  const accessibilityMenu = computed(() => data.value!.accessibilityMenu)
  const activitiesIndex = computed(() => data.value!.activitiesIndex)
  const activities = computed(() =>
    activityList.value.map((activity) => ({
      slot: activity.key,
      label: activity.menu.label,
      description: activity.menu.description,
      to: activity.to,
    })),
  )

  const headerLinks = computed(() => sortHeaderLinks(data.value?.pages ?? []))

  const footerPages = computed(() => data.value?.pages ?? [])
  const footerLegal = computed(() => data.value?.legal ?? [])
  const footerTitles = computed(() => data.value!.footer)
  const menuButton = computed(() => data.value!.menuButton)
  const colorModeButton = computed(() => data.value!.colorModeButton)

  return {
    logo,
    headerSocials,
    accessibility,
    accessibilityMenu,
    activitiesIndex,
    activities,
    headerLinks,
    footerPages,
    footerLegal,
    footerTitles,
    menuButton,
    colorModeButton,
  }
}
