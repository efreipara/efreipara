/**
 * Coordonnées et réseaux du club (collection `club`)
 */
export const useClub = async () => {
  const { t: club } = await useT('club')

  const socials = computed(() => club.socials ?? [])
  const maps = computed(() => mapUrls(club.address ?? ''))

  const getSocial = (key: string) => socials.value.find((social) => social.key === key)

  return { club, socials, maps, getSocial }
}
