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
