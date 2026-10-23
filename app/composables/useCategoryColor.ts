export function useCategoryColor() {
  const getCategoryColor = (color?: string) => categoryColorClasses(color)

  return { getCategoryColor }
}
