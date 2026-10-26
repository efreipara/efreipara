export function useCategoryColor() {
  const getCategoryColor = (color?: string) => categoryColorClasses(color)
  const getCategoryText = (color?: string) => categoryTextClass(color)

  return { getCategoryColor, getCategoryText }
}
