export const useNavigation = async () => {
  const { data } = await useAsyncData('navigation', () => queryCollection('navigation').first())

  const accessibility = computed(() => data.value!.accessibility)
  const activitiesIndex = computed(() => data.value!.activitiesIndex)
  const activities = computed(() => data.value?.activities ?? [])

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
