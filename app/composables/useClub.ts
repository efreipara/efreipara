/**
 * Coordonnées et réseaux du club (collection `club`)
 */
export const useClub = async () => {
  const { data } = await useAsyncData('club', () => queryCollection('club').first())

  const club = computed(() => data.value!)
  const socials = computed(() => data.value?.socials ?? [])
  const maps = computed(() => mapUrls(data.value?.address ?? ''))

  const getSocial = (key: string) => socials.value.find((social) => social.key === key)

  return { club, socials, maps, getSocial }
}
