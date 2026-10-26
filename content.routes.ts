import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

// Routes de redirection déduites du contenu : prérendues par nuxt.config.ts (aucun lien n'y mène),
// listées par les tests. Lecture directe des fichiers : Nuxt Content n'est pas disponible ici.
const readContent = (file: string) =>
  parse(readFileSync(new URL(`./content/${file}`, import.meta.url), 'utf8'))

export const redirectRoutes = () => {
  const socials = Object.keys(readContent('pages/redirects.yml').socials as Record<string, unknown>)
  const options = (readContent('pages/rejoindre.yml').options as { slug: string }[]).map(
    (option) => option.slug,
  )
  return [...socials, ...options].map((slug) => `/${slug}`)
}
