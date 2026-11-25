/**
 * Saison en cours (global/seasons.yml), d'après la date du navigateur seulement :
 * aucune au prérendu, si bien que la décoration n'apparaît qu'une fois la page montée.
 */
export const useSeason = async () => {
  // Avant l'await : le contexte Nuxt et le composant ne sont plus connus après
  const today = useState<string | null>('season-today', () => null)
  onMounted(() => (today.value = new Date().toISOString()))
  const { data } = await useContentData('seasons')

  const season = computed(() =>
    today.value ? activeSeason(data.value?.items ?? [], new Date(today.value)) : null,
  )

  return { season }
}
