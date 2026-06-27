// Tailwind scan: bg-blue-500/10 text-blue-500 hover:bg-blue-500/20
// bg-green-500/10 text-green-500 hover:bg-green-500/20
// bg-purple-500/10 text-purple-500 hover:bg-purple-500/20
// bg-red-500/10 text-red-500 hover:bg-red-500/20
// bg-orange-500/10 text-orange-500 hover:bg-orange-500/20
// bg-gray-500/10 text-gray-500 hover:bg-gray-500/20
const colorMap: Record<string, { bg: string; text: string; hoverBg: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', hoverBg: 'hover:bg-blue-500/20' },
  green: { bg: 'bg-green-500/10', text: 'text-green-500', hoverBg: 'hover:bg-green-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', hoverBg: 'hover:bg-purple-500/20' },
  red: { bg: 'bg-red-500/10', text: 'text-red-500', hoverBg: 'hover:bg-red-500/20' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', hoverBg: 'hover:bg-orange-500/20' },
  gray: { bg: 'bg-gray-500/10', text: 'text-gray-500', hoverBg: 'hover:bg-gray-500/20' },
}

export function useCategoryColor() {
  const getCategoryColor = (color?: string) =>
    colorMap[color ?? ''] ?? { bg: 'bg-primary/10', text: 'text-primary', hoverBg: 'hover:bg-primary/20' }

  return { getCategoryColor }
}
