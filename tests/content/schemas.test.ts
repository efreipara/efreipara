import { describe, expect, it } from 'vitest'
import { collections } from '../../content.schemas'
import { allContentFiles, readContent, sourceFiles } from './helpers'

describe('schémas des collections', () => {
  for (const [name, collection] of Object.entries(collections)) {
    const files = sourceFiles(collection.source)

    it(`${name} : la source ${collection.source} existe`, () => {
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

  it('chaque fichier de content/ appartient à une collection', () => {
    const covered = new Set(Object.values(collections).flatMap((c) => sourceFiles(c.source)))
    expect(allContentFiles().filter((file) => !covered.has(file))).toEqual([])
  })
})
