import { defineCollection, defineContentConfig } from '@nuxt/content'
import { collections } from './content.schemas'
import { ENABLED_LOCALE_CODES, localizedCollection, localizedSource } from './app/utils/locales'

// Une collection par langue publiée et par source : home_fr lit content/fr/pages/home.yml.
// Une langue désactivée n'a pas de collection : son texte n'est ni généré ni servi
export default defineContentConfig({
  collections: Object.fromEntries(
    ENABLED_LOCALE_CODES.flatMap((locale) =>
      Object.entries(collections).map(([name, collection]) => [
        localizedCollection(name, locale),
        defineCollection({ ...collection, source: localizedSource(collection.source, locale) }),
      ]),
    ),
  ),
})
