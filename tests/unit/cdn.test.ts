import { describe, expect, it } from 'vitest'
import { cdnImagePath, cdnSrcset, resolveCdnUrl } from '../../app/utils/cdn'

const baseUrl = 'https://cdn.example.org'

describe('resolveCdnUrl', () => {
  it("joint l'URL du CDN et le chemin", () => {
    expect(resolveCdnUrl({ baseUrl, path: 'tandem.jpg' })).toBe(
      'https://cdn.example.org/tandem.jpg',
    )
  })

  it('ne double pas les / entre la base et le chemin', () => {
    expect(resolveCdnUrl({ baseUrl: `${baseUrl}//`, path: '/tandem/tandem-1.jpg' })).toBe(
      'https://cdn.example.org/tandem/tandem-1.jpg',
    )
  })

  it('renvoie une chaîne vide sans CDN configuré', () => {
    expect(resolveCdnUrl({ baseUrl: '', path: 'tandem.jpg' })).toBe('')
  })

  it("n'ajoute jamais le jeton hors développement", () => {
    expect(resolveCdnUrl({ baseUrl, path: 'a.jpg', devToken: 'secret', isDev: false })).toBe(
      'https://cdn.example.org/a.jpg',
    )
  })

  it('ajoute le jeton en développement, encodé', () => {
    expect(resolveCdnUrl({ baseUrl, path: 'a.jpg', devToken: ' a b ', isDev: true })).toBe(
      'https://cdn.example.org/a.jpg?token=a%20b',
    )
  })

  it('ajoute le jeton après une query existante', () => {
    expect(resolveCdnUrl({ baseUrl, path: 'a.jpg?w=10', devToken: 't', isDev: true })).toBe(
      'https://cdn.example.org/a.jpg?w=10&token=t',
    )
  })

  it("n'ajoute rien en développement sans jeton", () => {
    expect(resolveCdnUrl({ baseUrl, path: 'a.jpg', devToken: '  ', isDev: true })).toBe(
      'https://cdn.example.org/a.jpg',
    )
  })
})

describe('cdnImagePath', () => {
  it('ajoute la largeur et .webp au chemin', () => {
    expect(cdnImagePath('activites/tandem', 960)).toBe('activites/tandem-960.webp')
  })
})

describe('cdnSrcset', () => {
  const urlFor = (path: string) => `${baseUrl}/${path}`

  it('liste les trois largeurs par défaut', () => {
    expect(cdnSrcset(urlFor, 'galerie/tandem-2025-05-18')).toBe(
      `${baseUrl}/galerie/tandem-2025-05-18-480.webp 480w, ` +
        `${baseUrl}/galerie/tandem-2025-05-18-960.webp 960w, ` +
        `${baseUrl}/galerie/tandem-2025-05-18-1600.webp 1600w`,
    )
  })

  it("s'arrête au plafond", () => {
    expect(cdnSrcset(urlFor, 'activites/carrousel/oa-1', 960)).toBe(
      `${baseUrl}/activites/carrousel/oa-1-480.webp 480w, ${baseUrl}/activites/carrousel/oa-1-960.webp 960w`,
    )
  })

  it('est vide sans CDN', () => {
    expect(cdnSrcset(() => '', 'activites/oa')).toBe('')
  })
})
