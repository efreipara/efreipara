import { describe, expect, it } from 'vitest'
import { goalName, isOutbound, linkLabel, pageGoalName } from '../../app/utils/goals'
import type { SeoData } from '../../app/utils/seo'

const link = (
  attributes: Record<string, string>,
  textContent: string | null = null,
  title: string | null = null,
) => ({
  getAttribute: (name: string) => attributes[name] ?? null,
  querySelector: () => (title === null ? null : { textContent: title }),
  textContent,
})

const seoData = {
  defaults: { separator: ' - ', siteName: 'Efrei Para' },
  pages: {
    index: { title: 'Efrei Para', description: '', goal: 'Accueil' },
    contact: { title: 'Contact', description: '' },
  },
} as unknown as SeoData

const faqSeo = {
  ...seoData,
  pages: { faq: { title: 'Questions fréquentes (FAQ)', description: '', goal: 'FAQ' } },
} as SeoData

describe('linkLabel', () => {
  it("préfère l'aria-label au texte", () => {
    expect(linkLabel(link({ 'aria-label': 'Instagram Efrei Para' }, ''))).toBe(
      'Instagram Efrei Para',
    )
  })

  it('préfère data-goal-title, valeur du lien puis élément marqué', () => {
    expect(
      linkLabel(link({ 'data-goal-title': 'Historique', 'aria-label': 'v1.2.3, historique' })),
    ).toBe('Historique')
    expect(linkLabel(link({}, 'SoufflerieBaptême 6 mars', ' Baptême en soufflerie '))).toBe(
      'Baptême en soufflerie',
    )
  })

  it('replie les espaces du texte visible', () => {
    expect(linkLabel(link({}, '\n  Nous\n   rejoindre  '))).toBe('Nous rejoindre')
  })

  it('ignore un aria-label vide', () => {
    expect(linkLabel(link({ 'aria-label': '  ' }, 'FAQ'))).toBe('FAQ')
  })

  it('coupe un libellé trop long', () => {
    const label = linkLabel(link({}, 'a'.repeat(80)))
    expect(label).toHaveLength(60)
    expect(label.endsWith('…')).toBe(true)
  })
})

describe('pageGoalName', () => {
  it('prend le champ goal de seo.yml', () => {
    expect(pageGoalName('/', 'Efrei Para', seoData)).toBe('Accueil')
  })

  it("retire « - Efrei Para » du titre de l'onglet", () => {
    expect(pageGoalName('/contact', 'Contact - Efrei Para', seoData)).toBe('Contact')
    expect(pageGoalName('/rgpd', 'Politique RGPD - Efrei Para', seoData)).toBe('Politique RGPD')
  })

  it('ignore la barre oblique finale du chemin', () => {
    expect(pageGoalName('/faq/', 'Questions fréquentes (FAQ) - Efrei Para', faqSeo)).toBe('FAQ')
  })

  it('garde le titre tel quel sans données SEO', () => {
    expect(pageGoalName('/contact', 'Contact - Efrei Para', null)).toBe('Contact - Efrei Para')
  })
})

describe('goalName', () => {
  it('joint la portée et le lien', () => {
    expect(goalName('Accueil', 'Nous rejoindre')).toBe('Accueil › Nous rejoindre')
  })

  it("n'envoie rien sans portée ni libellé", () => {
    expect(goalName('', 'FAQ')).toBeNull()
    expect(goalName('Accueil', '')).toBeNull()
  })
})

describe('isOutbound', () => {
  const origin = 'https://efreipara.fr'
  const redirects = ['/discord', '/rejoindre-bureau']

  it('compte un autre site, un e-mail et un téléphone', () => {
    expect(isOutbound('https://www.instagram.com/efreipara', origin, redirects)).toBe(true)
    expect(isOutbound('mailto:contact@efreipara.fr', origin, redirects)).toBe(true)
    expect(isOutbound('tel:+33100000000', origin, redirects)).toBe(true)
  })

  it('compte une page de redirection, avec ou sans barre oblique finale', () => {
    expect(isOutbound('/discord', origin, redirects)).toBe(true)
    expect(isOutbound('/rejoindre-bureau/', origin, redirects)).toBe(true)
  })

  it('ignore les pages et ancres du site', () => {
    expect(isOutbound('/galerie', origin, redirects)).toBe(false)
    expect(isOutbound('#donnees', origin, redirects)).toBe(false)
    expect(isOutbound('https://efreipara.fr/faq', origin, redirects)).toBe(false)
    expect(isOutbound(null, origin, redirects)).toBe(false)
  })
})
