import { queryCollection } from '@nuxt/content/server'
import { buildLlmsText, type LlmsData } from '../../app/utils/llms'

// Prérendue au generate (nitro.prerender.routes) : écrite en fichier, aucun serveur à l'exécution
export default defineEventHandler(async (event) => {
  const [
    seo,
    home,
    activitesIndex,
    activites,
    labels,
    rejoindre,
    events,
    faq,
    documents,
    galerie,
    partners,
    contact,
    club,
    navigation,
    legal,
  ] = await Promise.all([
    queryCollection(event, 'seo').first(),
    queryCollection(event, 'home').first(),
    queryCollection(event, 'activitesIndex').first(),
    queryCollection(event, 'activites').all(),
    queryCollection(event, 'labels').first(),
    queryCollection(event, 'rejoindre').first(),
    queryCollection(event, 'events').first(),
    queryCollection(event, 'faq').first(),
    queryCollection(event, 'documents').first(),
    queryCollection(event, 'galerie').first(),
    queryCollection(event, 'partners').first(),
    queryCollection(event, 'contact').first(),
    queryCollection(event, 'club').first(),
    queryCollection(event, 'navigation').first(),
    queryCollection(event, 'legal').select('title', 'description', 'path').all(),
  ])

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return buildLlmsText({
    seo,
    home,
    activitesIndex,
    activites,
    labels,
    rejoindre,
    events,
    faq,
    documents,
    galerie,
    partners,
    contact,
    club,
    navigation,
    legal,
  } as LlmsData)
})
