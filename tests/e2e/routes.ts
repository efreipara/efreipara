import { activityShortcuts, redirectRoutes as contentRedirects } from '../../content.routes'
import { siteRoutes } from '../content/helpers'

const redirects = contentRedirects()

// Pages affichées (les redirections quittent le site)
export const pages = siteRoutes().filter((route) => !redirects.includes(route))
export const redirectRoutes = redirects

// Raccourcis /<clé> → /activites/<clé>
export const shortcuts = activityShortcuts()
