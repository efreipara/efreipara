import { defineCollection, defineContentConfig } from '@nuxt/content'
import { collections } from './content.schemas'

export default defineContentConfig({
  collections: {
    home: defineCollection(collections.home),
    galerie: defineCollection(collections.galerie),
    activitesIndex: defineCollection(collections.activitesIndex),
    activites: defineCollection(collections.activites),
    legal: defineCollection(collections.legal),
    faq: defineCollection(collections.faq),
    documents: defineCollection(collections.documents),
    contact: defineCollection(collections.contact),
    cta: defineCollection(collections.cta),
    nextEvent: defineCollection(collections.nextEvent),
    partners: defineCollection(collections.partners),
    rejoindre: defineCollection(collections.rejoindre),
    redirects: defineCollection(collections.redirects),
    navigation: defineCollection(collections.navigation),
    seo: defineCollection(collections.seo),
  },
})
