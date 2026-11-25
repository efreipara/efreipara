import type { CollectionQueryBuilder, Collections } from '@nuxt/content'
import type { collections } from '~~/content.schemas'
import type { LocaleCode } from '~/utils/locales'

export type ContentName = keyof typeof collections

// Entrée d'une collection, identique dans toutes les langues (même schéma)
export type ContentItem<N extends ContentName> = Collections[`${N}_${LocaleCode}`]

interface ContentOptions<N extends ContentName, R> {
  /** Clé useAsyncData sans la langue, le nom de la collection par défaut */
  key?: string
  /** Requête sur la collection de la langue courante, `.first()` par défaut */
  query?: (collection: CollectionQueryBuilder<ContentItem<N>>, locale: LocaleCode) => Promise<R>
}

/**
 * Données d'une collection dans la langue courante. Clé suffixée par la langue (`home-fr`) :
 * une langue ne relit jamais le résultat d'une autre, et changer de langue relance la requête.
 *
 * @example
 * const { data } = await useContentData('activites', { query: (q) => q.select('stem', 'label').all() })
 */
export const useContentData = <N extends ContentName, R = ContentItem<N> | null>(
  name: N,
  options: ContentOptions<N, R> = {},
) => {
  // $i18n plutôt que useI18n() : utilisable aussi hors d'un composant (page d'erreur, plugin)
  const { locale } = useNuxtApp().$i18n
  return useAsyncData(
    computed(() => contentKey(options.key ?? name, locale.value)),
    () => {
      const code = locale.value as LocaleCode
      const collection = queryCollection(localizedCollection(name, code))
      return (options.query ? options.query(collection, code) : collection.first()) as Promise<R>
    },
  )
}

/**
 * Texte d'une collection dans la langue courante, lu en `t.cle.sous.cle` dans le script comme
 * dans le template.
 *
 * @example
 * const { t } = await useT('home')
 * t.hero.links
 */
export const useT = async <N extends ContentName, R = ContentItem<N> | null>(
  name: N,
  options: ContentOptions<N, R> = {},
) => {
  const { data, status } = await useContentData(name, options)
  const t = contentProxy(data as Ref<(NonNullable<R> & object) | undefined>)
  return { t, status }
}
