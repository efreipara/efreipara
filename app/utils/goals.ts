import { seoKeyFromPath, type SeoData } from './seo'

export const GOAL_SEPARATOR = ' › '
const MAX_LABEL_LENGTH = 60

interface LinkLike {
  getAttribute: (name: string) => string | null
  querySelector: (selector: string) => { textContent: string | null } | null
  textContent: string | null
}

const clean = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim()

// Nom stable du lien : data-goal-title (valeur, ou texte de l'élément marqué dans une carte),
// sinon nom lu par les lecteurs d'écran, sinon texte visible ; coupé au-delà de 60 caractères
export const linkLabel = (link: LinkLike) => {
  const label =
    clean(link.getAttribute('data-goal-title')) ||
    clean(link.querySelector('[data-goal-title]')?.textContent) ||
    clean(link.getAttribute('aria-label')) ||
    clean(link.textContent)
  return label.length > MAX_LABEL_LENGTH
    ? `${label.slice(0, MAX_LABEL_LENGTH - 1).trimEnd()}…`
    : label
}

// Nom court de seo.yml (`goal`) sinon titre de l'onglet sans « - Efrei Para »
export const pageGoalName = (pathname: string, documentTitle: string, seoData?: SeoData | null) => {
  const goal = seoData?.pages[seoKeyFromPath(pathname.replace(/(.)\/$/, '$1'))]?.goal
  if (goal) return goal
  const suffix = seoData ? `${seoData.defaults.separator}${seoData.defaults.siteName}` : ''
  const title = clean(documentTitle)
  return suffix && title.endsWith(suffix) ? title.slice(0, -suffix.length) : title
}

export const goalName = (scope: string, label: string) =>
  scope && label ? `${scope}${GOAL_SEPARATOR}${label}` : null

// Noms relevés sur les pages de la langue par défaut (bun run goals, goal-names.json) : une page
// d'une autre langue envoie les mêmes noms, sans nouveau Goal
export interface GoalNames {
  /** Chemin français → nom de la page */
  scopes: Record<string, string>
  /** `<portée>|<href>` (suivi de `#<rang>` à partir du deuxième lien identique) → nom complet */
  links: Record<string, string>
  /** data-goal-key → libellé, pour les liens dont l'adresse varie (inscription à un événement) */
  labels: Record<string, string>
}

// Rang : position du lien parmi ceux de même adresse dans la même zone (icône puis texte d'un
// même réseau dans le pied de page), identique d'une langue à l'autre
export const goalLinkKey = (scope: string, href: string, rank = 0) =>
  `${scope}|${href}${rank ? `#${rank}` : ''}`

// `path` et `href` interne sont déjà ramenés à l'adresse française (delocalizePath)
export const defaultLocaleGoalName = (
  names: GoalNames,
  link: { zone?: string; path: string; href: string; rank?: number; key?: string | null },
) => {
  const scope = link.zone ?? names.scopes[link.path]
  if (!scope) return null
  const label = link.key ? names.labels[link.key] : undefined
  return (
    names.links[goalLinkKey(scope, link.href, link.rank)] ?? (label ? goalName(scope, label) : null)
  )
}

// Lien qui sort du site : autre origine, autre protocole (mailto:, tel:) ou page de redirection
export const isOutbound = (href: string | null, origin: string, redirectPaths: string[]) => {
  if (!href) return false
  const url = new URL(href, origin)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return true
  if (url.origin !== origin) return true
  return redirectPaths.includes(url.pathname.replace(/(.)\/$/, '$1'))
}
