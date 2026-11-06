import { basename } from 'node:path'
import { describe, expect, it } from 'vitest'
import { defaultAccessibility } from '../../app/utils/accessibility'
import { ACTIVITY_KEYS } from '../../app/utils/activities'
import { readYaml, sourceFiles } from './helpers'

describe('activités', () => {
  it('chaque activité a son fichier, et chaque fichier est une activité', () => {
    const files = sourceFiles('pages/activites/*.yml').map((f) => basename(f, '.yml'))
    expect(files.sort()).toEqual([...ACTIVITY_KEYS].sort())
  })
})

describe('accessibilité', () => {
  it('chaque option du menu correspond à une option de useAccessibility', () => {
    const keys = readYaml<{ accessibility: { key: string }[] }>(
      'global/navigation.yml',
    ).accessibility.map((a) => a.key)
    expect(keys.filter((key) => !Object.hasOwn(defaultAccessibility, key))).toEqual([])
  })
})
