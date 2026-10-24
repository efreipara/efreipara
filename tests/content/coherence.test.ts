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

describe('redirections et options', () => {
  it('chaque option de « Nous rejoindre » a sa route de redirection', () => {
    const page = readText('app/pages/[page].vue')
    const slugs = readYaml<{ options: { slug: string }[] }>('pages/rejoindre.yml').options.map(
      (o) => o.slug,
    )
    expect(slugs.filter((slug) => !page.includes(`'${slug}'`))).toEqual([])
  })

  it('les redirections sont prérendues', () => {
    const config = readText('nuxt.config.ts')
    const slugs = [
      ...readYaml<{ options: { slug: string }[] }>('pages/rejoindre.yml').options.map(
        (o) => o.slug,
      ),
      ...Object.keys(readYaml('pages/redirects.yml')).filter((k) => k !== 'rejoindre'),
    ]
    expect(slugs.filter((slug) => !config.includes(`'/${slug}'`))).toEqual([])
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
