import { basename } from 'node:path'
import { describe, expect, it } from 'vitest'
import { ACTIVITY_ORDER } from '../../app/utils/activities'
import { readText, readYaml, sourceFiles } from './helpers'

const activities = new Set<string>(ACTIVITY_ORDER)
const notActivity = (values: string[]) => values.filter((value) => !activities.has(value))

describe('activités', () => {
  it('chaque activité a son fichier, et chaque fichier est une activité', () => {
    const files = sourceFiles('pages/activites/*.yml').map((f) => basename(f, '.yml'))
    expect(files.sort()).toEqual([...ACTIVITY_ORDER].sort())
  })

  it('la page des activités et le menu présentent chaque activité une fois', () => {
    const sections = readYaml<{ sections: { type: string }[] }>('pages/activites.yml').sections
    const menu = readYaml<{ activities: { slot: string; to: string }[] }>(
      'global/navigation.yml',
    ).activities
    expect(sections.map((s) => s.type).sort()).toEqual([...ACTIVITY_ORDER].sort())
    expect(menu.map((a) => a.slot).sort()).toEqual([...ACTIVITY_ORDER].sort())
    expect(menu.filter((a) => a.to !== `/activites/${a.slot}`)).toEqual([])
  })

  it('les types cités dans le contenu sont des activités', () => {
    const home = readYaml<{ activites: { items: { type: string }[] }; why: { type: string }[] }>(
      'pages/home.yml',
    )
    const galerie = readYaml<{ items: { type: string }[] }>('pages/galerie.yml')
    const partners = readYaml<{ items: { activites?: string[] }[] }>('global/partners.yml')
    const event = readYaml<{ type: string }>('global/next-event.yml')

    expect(notActivity(home.activites.items.map((i) => i.type))).toEqual([])
    expect(notActivity(home.why.map((i) => i.type))).toEqual([])
    expect(notActivity(galerie.items.map((i) => i.type))).toEqual([])
    expect(notActivity(partners.items.flatMap((p) => p.activites ?? []))).toEqual([])
    expect(notActivity([event.type])).toEqual([])
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
