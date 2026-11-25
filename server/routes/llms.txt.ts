import { queryCollection } from '@nuxt/content/server'
import { buildLlmsText, type LlmsData } from '../../app/utils/llms'
import { DEFAULT_LOCALE, localizedCollection } from '../../app/utils/locales'

// Collections de la langue par défaut : /llms.txt reste en français
const collection = <N extends string>(name: N) => localizedCollection(name, DEFAULT_LOCALE)

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
    queryCollection(event, collection('seo')).first(),
    queryCollection(event, collection('home')).first(),
    queryCollection(event, collection('activitesIndex')).first(),
    queryCollection(event, collection('activites')).all(),
    queryCollection(event, collection('labels')).first(),
    queryCollection(event, collection('rejoindre')).first(),
    queryCollection(event, collection('events')).first(),
    queryCollection(event, collection('faq')).first(),
    queryCollection(event, collection('documents')).first(),
    queryCollection(event, collection('galerie')).first(),
    queryCollection(event, collection('partners')).first(),
    queryCollection(event, collection('contact')).first(),
    queryCollection(event, collection('club')).first(),
    queryCollection(event, collection('navigation')).first(),
    queryCollection(event, collection('legal')).select('title', 'description', 'path').all(),
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
