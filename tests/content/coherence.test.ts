import { basename } from 'node:path'
import { describe, expect, it } from 'vitest'
import { ACTIVITY_KEYS } from '../../app/utils/activities'
import { readText, readYaml, sourceFiles } from './helpers'

describe('activités', () => {
  it('chaque activité a son fichier, et chaque fichier est une activité', () => {
    const files = sourceFiles('pages/activites/*.yml').map((f) => basename(f, '.yml'))
    expect(files.sort()).toEqual([...ACTIVITY_KEYS].sort())
  })
})

describe('accessibilité', () => {
  it('chaque option du menu correspond à une option de useAccessibility', () => {
    const composable = readText('app/composables/useAccessibility.ts')
    const keys = readYaml<{ accessibility: { key: string }[] }>(
      'global/navigation.yml',
    ).accessibility.map((a) => a.key)
    expect(keys.filter((key) => !new RegExp(`\\b${key}: false`).test(composable))).toEqual([])
  })
})

describe('réseaux', () => {
  it('chaque réseau de l’en-tête existe dans club.yml', () => {
    const keys = new Set(
      readYaml<{ socials: { key: string }[] }>('global/club.yml').socials.map((s) => s.key),
    )
    const header = readYaml<{ headerSocials: string[] }>('global/navigation.yml').headerSocials
    expect(header.filter((key) => !keys.has(key))).toEqual([])
  })
})
