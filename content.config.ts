import { defineCollection, defineContentConfig } from '@nuxt/content'
import { collections } from './content.schemas'
import { LOCALE_CODES, localizedCollection, localizedSource } from './app/utils/locales'

// Une collection par langue et par source : home_fr lit content/fr/pages/home.yml
export default defineContentConfig({
  collections: Object.fromEntries(
    LOCALE_CODES.flatMap((locale) =>
      Object.entries(collections).map(([name, collection]) => [
        localizedCollection(name, locale),
        defineCollection({ ...collection, source: localizedSource(collection.source, locale) }),
      ]),
    ),
  ),
})
