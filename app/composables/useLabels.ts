/**
 * Libellés des composants communs à plusieurs pages (collection `labels`)
 */
export const useLabels = async () => {
  const { t: labels } = await useT('labels')

  return { labels }
}
