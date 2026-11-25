// Langues du site : source unique pour nuxt.config.ts (i18n), content.config.ts et les tests.
// La première est la langue par défaut, servie sans préfixe d'URL.
export const LOCALES = [{ code: 'fr', language: 'fr-FR', name: 'Français' }] as const

export type LocaleCode = (typeof LOCALES)[number]['code']

export const LOCALE_CODES = LOCALES.map((locale) => locale.code) as LocaleCode[]

export const DEFAULT_LOCALE: LocaleCode = LOCALES[0].code

// Langue BCP 47 des dates (Intl) : celle de la locale courante, la langue par défaut sinon
export const DEFAULT_LANGUAGE: string = LOCALES[0].language

export const isLocale = (value: unknown): value is LocaleCode =>
  typeof value === 'string' && (LOCALE_CODES as string[]).includes(value)

// Nom de la collection d'une langue : home → home_fr
export const localizedCollection = <N extends string, L extends LocaleCode>(name: N, locale: L) =>
  `${name}_${locale}` as `${N}_${L}`

type Source = string | { include: string; prefix?: string }

// Source d'une collection dans le dossier de sa langue : pages/home.yml → fr/pages/home.yml
export const localizedSource = <S extends Source>(source: S, locale: LocaleCode): S =>
  (typeof source === 'string'
    ? `${locale}/${source}`
    : { ...(source as Exclude<Source, string>), include: `${locale}/${source.include}` }) as S

// Clé useAsyncData d'une donnée de contenu dans une langue : une clé par langue
export const contentKey = (key: string, locale: string) => `${key}-${locale}`
