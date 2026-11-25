import { readdirSync, readFileSync } from 'node:fs'
import { parse } from 'yaml'
import {
  DEFAULT_LOCALE,
  ENABLED_LOCALE_CODES,
  localizePath,
  type LocaleCode,
} from './app/utils/locales'

// Routes de redirection déduites du contenu : prérendues par nuxt.config.ts, comptées comme liens
// sortants par les goals Plausible, listées par les tests. Lecture directe des fichiers : Nuxt
// Content n'est pas disponible ici. Les adresses viennent du contenu de la langue par défaut.
const readContent = (file: string) =>
  parse(readFileSync(new URL(`./content/${DEFAULT_LOCALE}/${file}`, import.meta.url), 'utf8'))

// Mêmes slugs dans toutes les langues : /discord, /en/discord
export const redirectRoutes = (locale: LocaleCode = DEFAULT_LOCALE) => {
  const socials = Object.keys(readContent('pages/redirects.yml').socials as Record<string, unknown>)
  const options = (readContent('pages/rejoindre.yml').options as { slug: string }[]).map(
    (option) => option.slug,
  )
  return [...socials, ...options].map((slug) => localizePath(`/${slug}`, locale))
}

// Langues publiées seulement : prérendu, liens sortants des goals
export const allRedirectRoutes = () =>
  ENABLED_LOCALE_CODES.flatMap((locale) => redirectRoutes(locale))

// Adresse de production (seo.yml) : liens canoniques et hreflang absolus
export const siteBaseUrl = () =>
  (readContent('global/seo.yml') as { defaults: { baseUrl: string } }).defaults.baseUrl

// Raccourcis /<clé> vers /activites/<clé>, un par fichier d'activité
export const activityShortcuts = () =>
  readdirSync(new URL(`./content/${DEFAULT_LOCALE}/pages/activites/`, import.meta.url))
    .filter((file) => file.endsWith('.yml'))
    .map((file) => file.slice(0, -'.yml'.length))
    .sort()
