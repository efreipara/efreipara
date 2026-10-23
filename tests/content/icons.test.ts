import { readdirSync, readFileSync, globSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { allContentFiles, readContent, root, walk } from './helpers'

// Toutes les icônes sont embarquées au build (fallbackToApi: false) : une icône inconnue
// disparaît du site sans erreur.
const iconifySets = ['tabler', 'simple-icons'] as const
const customSets = readdirSync(join(root, 'app/assets/icons'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

const known = new Map<string, Set<string>>()
for (const set of iconifySets) {
  const data = JSON.parse(
    readFileSync(join(root, `node_modules/@iconify-json/${set}/icons.json`), 'utf8'),
  ) as { icons: Record<string, unknown>; aliases?: Record<string, unknown> }
  known.set(set, new Set([...Object.keys(data.icons), ...Object.keys(data.aliases ?? {})]))
}
for (const set of customSets) {
  const names = readdirSync(join(root, 'app/assets/icons', set))
    .filter((f) => f.endsWith('.svg'))
    .map((f) => f.replace(/\.svg$/, ''))
  known.set(set, new Set(names))
}

const prefixes = [...known.keys()]
const iconPattern = new RegExp(`^(${prefixes.join('|')}):([a-z0-9-]+)$`)
const iconInSource = new RegExp(`['"\`](${prefixes.join('|')}):([a-z0-9-]+)['"\`]`, 'g')

const exists = (name: string) => {
  const [, set, icon] = name.match(iconPattern) ?? []
  return !!set && !!icon && known.get(set)!.has(icon)
}

describe('icônes', () => {
  it('chaque icône du contenu existe', () => {
    const missing: string[] = []
    for (const file of allContentFiles()) {
      walk(readContent(file), (_key, value, path) => {
        if (typeof value === 'string' && iconPattern.test(value) && !exists(value))
          missing.push(`${file} › ${path} : ${value}`)
      })
    }
    expect(missing).toEqual([])
  })

  it('chaque icône écrite dans le code existe', () => {
    const files = [
      ...globSync('app/**/*.{vue,ts}', { cwd: root }),
      'nuxt.config.ts',
      'app/app.config.ts',
    ]
    const missing: string[] = []
    for (const file of files) {
      for (const [, set, icon] of readFileSync(join(root, file), 'utf8').matchAll(iconInSource)) {
        if (!known.get(set!)!.has(icon!)) missing.push(`${file} : ${set}:${icon}`)
      }
    }
    expect(missing).toEqual([])
  })
})
