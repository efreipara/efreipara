export const useNavigation = async () => {
  // Lancées ensemble : un composable appelé après un await perd le contexte Nuxt
  const [{ data }, { activities: activityList }] = await Promise.all([
    useAsyncData('navigation', () => queryCollection('navigation').first()),
    useActivities(),
  ])

  const accessibility = computed(() => data.value!.accessibility)
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

  return {
    accessibility,
    activitiesIndex,
    activities,
    headerLinks,
    footerPages,
    footerLegal,
    footerTitles,
  }
}
