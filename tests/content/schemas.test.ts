import { readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { collections } from '../../content.schemas'
import { DEFAULT_LOCALE, LOCALE_CODES, OPTIONAL_TRANSLATIONS } from '../../app/utils/locales'
import { allContentFiles, contentDir, readContent, sourceFiles } from './helpers'

describe('schémas des collections', () => {
  for (const locale of LOCALE_CODES) {
    for (const [name, collection] of Object.entries(collections)) {
      const files = sourceFiles(collection.source, locale)
      const optional = locale !== DEFAULT_LOCALE && OPTIONAL_TRANSLATIONS.includes(name)

      if (!optional)
        it(`${locale}/${name} : la source de la collection existe`, () => {
          expect(files.length).toBeGreaterThan(0)
        })

      for (const file of files) {
        it(`${locale}/${name} : ${file} respecte son schéma`, () => {
          const result = collection.schema.safeParse(readContent(file, locale))
          const issues = result.success
            ? []
            : result.error.issues.map((issue) => `${issue.path.join('.')} : ${issue.message}`)
          expect(issues).toEqual([])
        })
      }
    }

    it(`${locale} : chaque fichier appartient à une collection`, () => {
      const covered = new Set(
        Object.values(collections).flatMap((c) => sourceFiles(c.source, locale)),
      )
      expect(allContentFiles(locale).filter((file) => !covered.has(file))).toEqual([])
    })

    it(`${locale} : mêmes fichiers que la langue par défaut, sauf collections facultatives`, () => {
      const optionalFiles = new Set(
        OPTIONAL_TRANSLATIONS.flatMap((name) =>
          sourceFiles(collections[name as keyof typeof collections].source),
        ),
      )
      const own = allContentFiles(locale)
      expect(own.filter((file) => !allContentFiles().includes(file))).toEqual([])
      expect(
        allContentFiles().filter(
          (file) => !own.includes(file) && (locale === DEFAULT_LOCALE || !optionalFiles.has(file)),
        ),
      ).toEqual([])
    })
  }

  it('content/ ne contient qu’un dossier par langue déclarée', () => {
    expect(
      readdirSync(contentDir)
        .filter((name) => !name.startsWith('.'))
        .sort(),
    ).toEqual([...LOCALE_CODES].sort())
  })

  it('refuse un lien javascript:, data: ou //hôte', () => {
    const file = 'pages/rejoindre.yml'
    for (const link of ['javascript:alert(1)', 'data:text/html,x', '//exemple.test']) {
      const data = structuredClone(readContent(file))
      data.options[0].link = link
      expect(collections.rejoindre.schema.safeParse(data).success).toBe(false)
    }
  })

  it('refuse un événement sans date ni mois, avec les deux, ou aux mois désordonnés', () => {
    const base = { title: 'Saut', type: 'tandem' }
    for (const event of [
      base,
      { ...base, date: '2027-05-15', months: ['2027-05'] },
      { ...base, months: ['2027-06', '2027-05'] },
      { ...base, months: ['2027-13'] },
    ]) {
      expect(collections.events.schema.safeParse({ items: [event] }).success).toBe(false)
    }
    expect(collections.events.schema.safeParse({ items: [] }).success).toBe(true)
  })
})
