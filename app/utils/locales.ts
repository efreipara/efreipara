// Langues du site : source unique pour nuxt.config.ts (i18n), content.config.ts et les tests.
// La première est la langue par défaut, servie sans préfixe d'URL. `enabled: false` : contenu
// tenu à jour et testé, mais langue non publiée (ni adresses /en, ni bouton de langue)
export const LOCALES = [
  { code: 'fr', language: 'fr-FR', name: 'Français', enabled: true },
  { code: 'en', language: 'en-GB', name: 'English', enabled: false },
] as const

export type LocaleCode = (typeof LOCALES)[number]['code']

export const LOCALE_CODES = LOCALES.map((locale) => locale.code) as LocaleCode[]

// Langues publiées : routes, bouton de langue, hreflang, prérendu
export const ENABLED_LOCALES = LOCALES.filter((locale) => locale.enabled)

export const ENABLED_LOCALE_CODES = ENABLED_LOCALES.map((locale) => locale.code) as LocaleCode[]

export const DEFAULT_LOCALE = LOCALES[0].code

// Langue BCP 47 des dates (Intl) : celle de la locale courante, la langue par défaut sinon
export const DEFAULT_LANGUAGE: string = LOCALES[0].language

export const isLocale = (value: unknown): value is LocaleCode =>
  typeof value === 'string' && (LOCALE_CODES as string[]).includes(value)

// Adresses traduites, par nom de route (customRoutes: 'config') : une page absente, ou une langue
// absente d'une page, garde le chemin français sous le préfixe de la langue (/en/faq)
export const LOCALIZED_PATHS: Record<string, Partial<Record<LocaleCode, string>>> = {
  activites: { en: '/activities' },
  'activites-activite': { en: '/activities/[activite]' },
  galerie: { en: '/gallery' },
  rejoindre: { en: '/join' },
}

// Adresses traduites des langues publiées seulement (configuration d'i18n)
export const enabledLocalizedPaths = () =>
  Object.fromEntries(
    Object.entries(LOCALIZED_PATHS).map(([name, paths]) => [
      name,
      Object.fromEntries(
        Object.entries(paths).filter(([code]) => (ENABLED_LOCALE_CODES as string[]).includes(code)),
      ),
    ]),
  )

// Chemin d'une page dans une langue, à partir de son chemin français : /galerie → /en/gallery,
// /activites/tandem → /en/activities/tandem (clés et slugs inchangés)
export const localizePath = (path: string, locale: LocaleCode) => {
  if (locale === DEFAULT_LOCALE) return path
  const [first = '', ...rest] = path.split('/').filter(Boolean)
  const head = LOCALIZED_PATHS[first]?.[locale] ?? (first ? `/${first}` : '')
  return `/${locale}${head}${rest.map((segment) => `/${segment}`).join('')}`
}

// Chemin français d'une page d'une autre langue : /en/gallery → /galerie, /en → /
export const delocalizePath = (path: string) => {
  const [prefix, first = '', ...rest] = path.split('/').filter(Boolean)
  if (!isLocale(prefix) || prefix === DEFAULT_LOCALE) return path
  // Seules les pages d'un segment (activites, galerie) donnent le segment français
  const name = Object.entries(LOCALIZED_PATHS).find(
    ([, paths]) => paths[prefix] === `/${first}`,
  )?.[0]
  return `/${[name ?? first, ...rest].filter(Boolean).join('/')}`
}

// Collections qu'une langue peut omettre : la langue par défaut sert alors. Données sans texte à
// traduire (coordonnées, partenaires, saisons), écrites une seule fois, et pages légales, en
// français seulement pour l'instant
export const OPTIONAL_TRANSLATIONS: readonly string[] = ['club', 'partners', 'seasons', 'legal']

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
