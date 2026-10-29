import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { scanExports } from 'unimport'
import { describe, expect, it } from 'vitest'

// Nuxt n'auto-importe que les exports vus par unimport (mlly). Un `export const X = [ … ]`
// lui masque l'export suivant : la fonction manque au rendu (« … is not defined », erreur 500).
const dirs = ['app/utils', 'app/composables']
const files = dirs.flatMap((dir) =>
  readdirSync(dir)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => join(dir, file)),
)

describe('imports automatiques', () => {
  it.each(files)('%s : chaque export est vu par Nuxt', async (file) => {
    const declared = [
      ...readFileSync(file, 'utf8').matchAll(/^export (?:async )?(?:const|function|class) (\w+)/gm),
    ].map((match) => match[1])
    const scanned = (await scanExports(join(process.cwd(), file), false)).map(({ name }) => name)
    expect(declared.filter((name) => !scanned.includes(name))).toEqual([])
  })
})
