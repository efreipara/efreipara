import { describe, expect, it } from 'vitest'
import { seoKeyFromPath } from '../../app/utils/seo'
import {
  allContentFiles,
  publicFileExists,
  readContent,
  readYaml,
  siteRoutes,
  sourceFiles,
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

  // Pages dont le fichier de contenu porte le SEO : front-matter légal, options de « Nous rejoindre »
  const legal = sourceFiles('pages/legal/*.md').map((file) => ({
    key: file.replace('pages/legal/', '').replace('.md', ''),
    seo: readContent(file) as { title?: string; description?: string },
  }))
  const options = readYaml<{
    options: { slug: string; title: string; description: string; ogImage: string }[]
  }>('pages/rejoindre.yml').options
  const ownSeo = new Set([
    ...legal.filter((page) => page.seo.title && page.seo.description).map((page) => page.key),
    ...options.map((option) => option.slug),
  ])

  it('chaque page a son SEO, dans seo.yml ou dans son propre fichier', () => {
    const missing = [...routes].filter((route) => {
      const key = seoKeyFromPath(route)
      return !seo.pages[key] && !ownSeo.has(key)
    })
    expect(missing).toEqual([])
  })

  it('une page ne déclare pas son SEO à deux endroits', () => {
    expect([...ownSeo].filter((key) => seo.pages[key])).toEqual([])
  })

  it('chaque image de partage existe dans public/', () => {
    const images = [
      seo.defaults.ogImage,
      ...Object.values(seo.pages).map((p) => p.ogImage),
      ...options.map((option) => option.ogImage),
    ]
    const missing = images.filter((img): img is string => !!img && !publicFileExists(img))
    expect(missing).toEqual([])
  })
})
