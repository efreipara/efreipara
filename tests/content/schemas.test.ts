import { describe, expect, it } from 'vitest'
import { collections } from '../../content.schemas'
import { allContentFiles, readContent, sourceFiles } from './helpers'

describe('schémas des collections', () => {
  for (const [name, collection] of Object.entries(collections)) {
    const files = sourceFiles(collection.source)

    it(`${name} : la source de la collection existe`, () => {
      expect(files.length).toBeGreaterThan(0)
    })

    for (const file of files) {
      it(`${name} : ${file} respecte son schéma`, () => {
        const result = collection.schema.safeParse(readContent(file))
        const issues = result.success
          ? []
          : result.error.issues.map((issue) => `${issue.path.join('.')} : ${issue.message}`)
        expect(issues).toEqual([])
      })
    }
  }

  it('refuse un lien javascript:, data: ou //hôte', () => {
    const file = 'pages/rejoindre.yml'
    for (const link of ['javascript:alert(1)', 'data:text/html,x', '//exemple.test']) {
      const data = structuredClone(readContent(file))
      data.options[0].link = link
      expect(collections.rejoindre.schema.safeParse(data).success).toBe(false)
    }
  })

  it('chaque fichier de content/ appartient à une collection', () => {
    const covered = new Set(Object.values(collections).flatMap((c) => sourceFiles(c.source)))
    expect(allContentFiles().filter((file) => !covered.has(file))).toEqual([])
  })
})
