import { describe, expect, it } from 'vitest'
import { seoKeyFromPath } from '../../app/utils/seo'
import {
  allContentFiles,
  publicFileExists,
  readContent,
  readYaml,
  siteRoutes,
  walk,
} from './helpers'

const routes = new Set(siteRoutes())
const linkKeys = new Set(['to', 'url', 'link'])

describe('liens internes', () => {
  it('chaque lien interne du contenu mène à une page ou à un fichier de public/', () => {
    const broken: string[] = []
    for (const file of allContentFiles()) {
      walk(readContent(file), (key, value, path) => {
        if (!linkKeys.has(key) || typeof value !== 'string' || !value.startsWith('/')) return
        const target = value.split(/[?#]/)[0]!
        if (!routes.has(target) && !publicFileExists(target))
          broken.push(`${file} › ${path} : ${value}`)
      })
    }
    expect(broken).toEqual([])
  })
})

describe('SEO', () => {
  const seo = readYaml<{
    defaults: { ogImage: string }
    pages: Record<string, { ogImage?: string }>
  }>('global/seo.yml')

  it('chaque page a son entrée dans seo.yml', () => {
    const missing = [...routes].filter((route) => !seo.pages[seoKeyFromPath(route)])
    expect(missing).toEqual([])
  })

  it('chaque image de partage existe dans public/', () => {
    const images = [seo.defaults.ogImage, ...Object.values(seo.pages).map((p) => p.ogImage)]
    const missing = images.filter((img): img is string => !!img && !publicFileExists(img))
    expect(missing).toEqual([])
  })
})
