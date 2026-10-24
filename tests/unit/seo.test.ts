import { describe, expect, it } from 'vitest'
import { buildCanonicalUrl, buildSeoMeta, seoKeyFromPath, type SeoData } from '../../app/utils/seo'

const seoData: SeoData = {
  defaults: {
    siteName: 'Efrei Para',
    separator: ' - ',
    baseUrl: 'https://efreipara.fr',
    ogImage: '/seo/efreipara.png',
    ogType: 'website',
    ogSiteName: 'Efrei Para',
    twitterCard: 'summary_large_image',
    locale: 'fr_FR',
    themeColor: '#000000',
    author: 'Efrei Para',
  },
  pages: {
    index: { title: 'Efrei Para', description: 'Accueil' },
    faq: { title: 'FAQ', description: 'Questions' },
    'activites-tandem': { title: 'Tandem', description: 'Saut', ogImage: '/seo/tandem.png' },
    qr: { title: 'QR Code', description: 'QR', robots: 'noindex, nofollow' },
  },
}

describe('seoKeyFromPath', () => {
  it("donne « index » pour l'accueil", () => {
    expect(seoKeyFromPath('/')).toBe('index')
  })

  it('retire le / initial et remplace les / suivants par des tirets', () => {
    expect(seoKeyFromPath('/faq')).toBe('faq')
    expect(seoKeyFromPath('/activites/tandem')).toBe('activites-tandem')
  })
})

describe('buildCanonicalUrl', () => {
  it("donne l'URL de base pour l'accueil", () => {
    expect(buildCanonicalUrl('https://efreipara.fr', 'index')).toBe('https://efreipara.fr')
  })

  it('remet le / des pages d’activité', () => {
    expect(buildCanonicalUrl('https://efreipara.fr', 'activites-tandem')).toBe(
      'https://efreipara.fr/activites/tandem',
    )
  })

  it("n'en produit pas sans URL de base", () => {
    expect(buildCanonicalUrl('', 'faq')).toBeUndefined()
  })
})

describe('buildSeoMeta', () => {
  it("garde le titre seul pour l'accueil", () => {
    expect(buildSeoMeta(seoData, 'index').title).toBe('Efrei Para')
  })

  it('suffixe le titre des autres pages avec le nom du site', () => {
    const meta = buildSeoMeta(seoData, 'faq')
    expect(meta.title).toBe('FAQ - Efrei Para')
    expect(meta.ogTitle).toBe('FAQ - Efrei Para')
    expect(meta.canonicalUrl).toBe('https://efreipara.fr/faq')
  })

  it("prend l'image de la page, sinon celle par défaut", () => {
    expect(buildSeoMeta(seoData, 'activites-tandem').ogImage).toBe('/seo/tandem.png')
    expect(buildSeoMeta(seoData, 'faq').ogImage).toBe('/seo/efreipara.png')
  })

  it('indexe par défaut et respecte un robots de page', () => {
    expect(buildSeoMeta(seoData, 'faq').robots).toBe('index, follow')
    expect(buildSeoMeta(seoData, 'qr').robots).toBe('noindex, nofollow')
  })

  it('applique le robots des valeurs par défaut aux pages qui n’en ont pas', () => {
    const data = { ...seoData, defaults: { ...seoData.defaults, robots: 'noindex, follow' } }
    expect(buildSeoMeta(data, 'faq').robots).toBe('noindex, follow')
    expect(buildSeoMeta(data, 'qr').robots).toBe('noindex, nofollow')
  })

  it('se rabat sur le nom du site pour une page sans entrée', () => {
    const meta = buildSeoMeta(seoData, 'inconnue')
    expect(meta.title).toBe('Efrei Para - Efrei Para')
    expect(meta.description).toBe('')
  })

  it('tire la langue de la locale', () => {
    expect(buildSeoMeta(seoData, 'index').htmlLang).toBe('fr')
  })
})

describe('buildSeoMeta avec les options de la page', () => {
  it('les options de la page l’emportent sur seo.yml', () => {
    const meta = buildSeoMeta(seoData, 'activites-tandem', {
      title: 'Saut en tandem',
      ogImage: '/seo/autre.png',
    })
    expect(meta.title).toBe('Saut en tandem - Efrei Para')
    expect(meta.description).toBe('Saut')
    expect(meta.ogImage).toBe('/seo/autre.png')
  })

  it('une page absente de seo.yml prend ses options et les valeurs par défaut', () => {
    const meta = buildSeoMeta(seoData, 'rgpd', { title: 'RGPD', description: 'Données' })
    expect(meta.title).toBe('RGPD - Efrei Para')
    expect(meta.description).toBe('Données')
    expect(meta.ogImage).toBe('/seo/efreipara.png')
  })

  it('ignore une option vide', () => {
    expect(buildSeoMeta(seoData, 'faq', { title: undefined }).title).toBe('FAQ - Efrei Para')
  })
})
