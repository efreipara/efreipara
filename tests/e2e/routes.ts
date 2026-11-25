import { DEFAULT_LOCALE, LOCALE_CODES, type LocaleCode } from '../../app/utils/locales'
import { activityShortcuts, redirectRoutes as contentRedirects } from '../../content.routes'
import { siteRoutes } from '../content/helpers'

// Pages affichées d'une langue (les redirections quittent le site)
export const localePages = (locale: LocaleCode) => {
  const redirects = contentRedirects(locale)
  return siteRoutes(locale).filter((route) => !redirects.includes(route))
}

// Toutes les langues : pages, accessibilité, SEO ; la langue par défaut seule pour les goals
export const pages = LOCALE_CODES.flatMap(localePages)
export const defaultPages = localePages(DEFAULT_LOCALE)
export const redirectRoutes = LOCALE_CODES.flatMap((locale) => contentRedirects(locale))

// Raccourcis /<clé> → /activites/<clé>
export const shortcuts = activityShortcuts()
