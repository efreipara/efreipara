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
    club: defineCollection(collections.club),
    labels: defineCollection(collections.labels),
    events: defineCollection(collections.events),
    partners: defineCollection(collections.partners),
    rejoindre: defineCollection(collections.rejoindre),
    qr: defineCollection(collections.qr),
    redirects: defineCollection(collections.redirects),
    navigation: defineCollection(collections.navigation),
    seo: defineCollection(collections.seo),
  },
})
