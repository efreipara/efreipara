import { existsSync, globSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { parse } from 'yaml'

export const root = join(import.meta.dirname, '../..')
export const contentDir = join(root, 'content')

export const readText = (path: string) => readFileSync(join(root, path), 'utf8')

// Fichiers d'une source de collection (`pages/activites/*.yml`), relatifs à content/
export const sourceFiles = (source: string) => globSync(source, { cwd: contentDir }).sort()

// YAML, ou front-matter d'un Markdown
export const readContent = (file: string): unknown => {
  const text = readFileSync(join(contentDir, file), 'utf8')
  if (file.endsWith('.md')) {
    const match = text.match(/^---\n([\s\S]*?)\n---/)
    return match ? parse(match[1]!) : {}
  }
  return parse(text)
}

export const readYaml = <T = Record<string, unknown>>(file: string) => readContent(file) as T

// Parcourt toutes les valeurs d'un document : [clé, valeur, chemin lisible]
export const walk = (
  value: unknown,
  visit: (key: string, value: unknown, path: string) => void,
  path = '',
  key = '',
) => {
  visit(key, value, path)
  if (Array.isArray(value)) value.forEach((item, i) => walk(item, visit, `${path}[${i}]`, key))
  else if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) walk(v, visit, path ? `${path}.${k}` : k, k)
}

export const allContentFiles = () => globSync('**/*.{yml,md}', { cwd: contentDir }).sort()

export const publicFileExists = (path: string) => existsSync(join(root, 'public', path))

// Routes du site, déduites des pages et du contenu
export const siteRoutes = () => {
  const activities = sourceFiles('pages/activites/*.yml').map((f) => basename(f, '.yml'))
  const legal = sourceFiles('pages/legal/*.md').map((f) => basename(f, '.md'))
  const rejoindre = readYaml<{ options: { slug: string }[] }>('pages/rejoindre.yml')
  const redirects = Object.keys(readYaml('pages/redirects.yml')).filter((k) => k !== 'rejoindre')
  const pages = globSync('*.vue', { cwd: join(root, 'app/pages') })
    .map((f) => basename(f, '.vue'))
    .filter((name) => !name.startsWith('['))
    .map((name) => (name === 'index' ? '/' : `/${name}`))

  return [
    ...pages,
    '/activites',
    ...activities.map((a) => `/activites/${a}`),
    ...legal.map((slug) => `/${slug}`),
    ...rejoindre.options.map((o) => `/${o.slug}`),
    ...redirects.map((key) => `/${key}`),
  ]
}
