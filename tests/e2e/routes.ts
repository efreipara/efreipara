import { siteRoutes } from '../content/helpers'

const redirects = ['/discord', '/instagram', '/devenir-membre', '/rejoindre-bureau']

// Pages affichées (les redirections quittent le site)
export const pages = siteRoutes().filter((route) => !redirects.includes(route))
export const redirectRoutes = redirects
