/**
 * Libellés des composants communs à plusieurs pages (collection `labels`)
 */
export const useLabels = async () => {
  const { data } = await useAsyncData('labels', () => queryCollection('labels').first())

  const labels = computed(() => data.value!)

  return { labels }
}
