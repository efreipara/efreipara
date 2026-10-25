// Tailwind scan:
// bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:bg-blue-500/5 before:bg-blue-500
// bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:bg-green-500/5 before:bg-green-500
// bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 hover:bg-purple-500/5 before:bg-purple-500
// bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:bg-red-500/5 before:bg-red-500
// bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 hover:bg-orange-500/5 before:bg-orange-500
// bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 hover:bg-gray-500/5 before:bg-gray-500
// bg (pastilles), text (icônes), hoverBg (survol des pastilles), rowHover (survol d'une ligne de
// document), bar (trait de la question ouverte de la FAQ, pseudo-élément ::before)
const colorMap: Record<string, Record<'bg' | 'text' | 'hoverBg' | 'rowHover' | 'bar', string>> = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    hoverBg: 'hover:bg-blue-500/20',
    rowHover: 'hover:bg-blue-500/5',
    bar: 'before:bg-blue-500',
  },
  green: {
    bg: 'bg-green-500/10',
    text: 'text-green-500',
    hoverBg: 'hover:bg-green-500/20',
    rowHover: 'hover:bg-green-500/5',
    bar: 'before:bg-green-500',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-500',
    hoverBg: 'hover:bg-purple-500/20',
    rowHover: 'hover:bg-purple-500/5',
    bar: 'before:bg-purple-500',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-500',
    hoverBg: 'hover:bg-red-500/20',
    rowHover: 'hover:bg-red-500/5',
    bar: 'before:bg-red-500',
  },
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-500',
    hoverBg: 'hover:bg-orange-500/20',
    rowHover: 'hover:bg-orange-500/5',
    bar: 'before:bg-orange-500',
  },
  gray: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-500',
    hoverBg: 'hover:bg-gray-500/20',
    rowHover: 'hover:bg-gray-500/5',
    bar: 'before:bg-gray-500',
  },
}

export const categoryColorClasses = (color?: string) =>
  colorMap[color ?? ''] ?? {
    bg: 'bg-primary/10',
    text: 'text-primary',
    hoverBg: 'hover:bg-primary/20',
    rowHover: 'hover:bg-primary/5',
    bar: 'before:bg-primary',
  }

// Texte d'une pastille : -500 n'atteint pas 4,5:1 sur le fond /10, en clair comme en sombre
const textMap: Record<string, string> = {
  blue: 'text-blue-700 dark:text-blue-400',
  green: 'text-green-800 dark:text-green-400',
  purple: 'text-purple-700 dark:text-purple-400',
  red: 'text-red-700 dark:text-red-400',
  orange: 'text-orange-800 dark:text-orange-400',
  gray: 'text-gray-700 dark:text-gray-400',
}

export const categoryTextClass = (color?: string) => textMap[color ?? ''] ?? 'text-primary'
