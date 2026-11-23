import { readdirSync, readFileSync } from 'node:fs'
import { parse } from 'yaml'

// Routes de redirection déduites du contenu : prérendues par nuxt.config.ts, comptées comme liens
// sortants par les goals Plausible, listées par les tests. Lecture directe des fichiers : Nuxt
// Content n'est pas disponible ici.
const readContent = (file: string) =>
  parse(readFileSync(new URL(`./content/${file}`, import.meta.url), 'utf8'))

export const redirectRoutes = () => {
  const socials = Object.keys(readContent('pages/redirects.yml').socials as Record<string, unknown>)
  const options = (readContent('pages/rejoindre.yml').options as { slug: string }[]).map(
    (option) => option.slug,
  )
  return [...socials, ...options].map((slug) => `/${slug}`)
}

// Raccourcis /<clé> vers /activites/<clé>, un par fichier d'activité
export const activityShortcuts = () =>
  readdirSync(new URL('./content/pages/activites/', import.meta.url))
    .filter((file) => file.endsWith('.yml'))
    .map((file) => file.slice(0, -'.yml'.length))
    .sort()
