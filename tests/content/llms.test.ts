import { basename } from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildLlmsText, type LlmsData } from '../../app/utils/llms'
import { collections } from '../../content.schemas'
import { readYaml, siteRoutes, sourceFiles } from './helpers'

// Données telles que les lit /llms.txt (server/routes/llms.txt.ts), à partir des vrais fichiers
const single = (name: keyof typeof collections) => readYaml(collections[name].source as string)

const data = {
  seo: single('seo'),
  home: single('home'),
  activitesIndex: single('activitesIndex'),
  activites: sourceFiles('pages/activites/*.yml').map((file) => ({
    ...readYaml(file),
    stem: file.replace(/\.yml$/, ''),
  })),
  labels: single('labels'),
  rejoindre: single('rejoindre'),
  events: single('events'),
  faq: single('faq'),
  documents: single('documents'),
  galerie: single('galerie'),
  partners: single('partners'),
  contact: single('contact'),
  club: single('club'),
  navigation: single('navigation'),
  legal: sourceFiles(collections.legal.source).map((file) => ({
    ...readYaml(file),
    path: `/${basename(file, '.md')}`,
  })),
} as unknown as LlmsData

describe('llms.txt', () => {
  const text = buildLlmsText(data)

  it('ne contient aucune valeur manquante', () => {
    expect(text).not.toMatch(/undefined|null|\[object |\{\w+\}/)
  })

  it('reprend chaque activité', () => {
    for (const activity of data.activites) expect(text).toContain(`### ${activity.title}`)
  })

  it('ne donne pas l’e-mail du support technique', () => {
    expect(text).not.toContain(single('club').maintainerEmail as string)
  })

  it('pointe vers des pages du site qui existent', () => {
    const routes = new Set(siteRoutes())
    const internal = [...text.matchAll(/https:\/\/efreipara\.fr(\/[^\s)>]*)/g)].map((m) => m[1]!)
    expect(internal.length).toBeGreaterThan(0)
    expect(internal.filter((path) => !routes.has(path))).toEqual([])
  })
})
