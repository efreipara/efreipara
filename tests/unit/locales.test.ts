import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { contentProxy } from '../../app/utils/content-proxy'
import {
  DEFAULT_LOCALE,
  LOCALE_CODES,
  contentKey,
  delocalizePath,
  isLocale,
  localizedCollection,
  localizedSource,
  localizePath,
} from '../../app/utils/locales'

describe('langues', () => {
  it('le français est la langue par défaut, l’anglais la seconde', () => {
    expect(DEFAULT_LOCALE).toBe('fr')
    expect(LOCALE_CODES).toEqual(['fr', 'en'])
  })

  it('reconnaît une langue déclarée seulement', () => {
    expect(isLocale('fr')).toBe(true)
    expect(isLocale('xx')).toBe(false)
    expect(isLocale(undefined)).toBe(false)
  })

  it('suffixe le nom de collection et la clé par la langue', () => {
    expect(localizedCollection('home', 'fr')).toBe('home_fr')
    expect(contentKey('activites-index', 'fr')).toBe('activites-index-fr')
  })

  it('place la source dans le dossier de la langue, préfixe d’adresse conservé', () => {
    expect(localizedSource('pages/home.yml', 'fr')).toBe('fr/pages/home.yml')
    expect(localizedSource({ include: 'pages/legal/*.md', prefix: '/' }, 'fr')).toEqual({
      include: 'fr/pages/legal/*.md',
      prefix: '/',
    })
  })
})

describe('contentProxy', () => {
  it('lit la valeur courante de la ref à chaque accès', () => {
    const data = ref<{ hero: { title: string } } | null>(null)
    const t = contentProxy(data)
    expect(t.hero).toBeUndefined()
    data.value = { hero: { title: 'Bienvenue' } }
    expect(t.hero.title).toBe('Bienvenue')
    expect('hero' in t).toBe(true)
    expect(Object.keys(t)).toEqual(['hero'])
    expect({ ...t }).toEqual({ hero: { title: 'Bienvenue' } })
  })
})

describe('adresses par langue', () => {
  it('traduit le premier segment et garde clés et slugs', () => {
    expect(localizePath('/', 'en')).toBe('/en')
    expect(localizePath('/galerie', 'en')).toBe('/en/gallery')
    expect(localizePath('/activites/tandem', 'en')).toBe('/en/activities/tandem')
    expect(localizePath('/faq', 'en')).toBe('/en/faq')
    expect(localizePath('/discord', 'en')).toBe('/en/discord')
    expect(localizePath('/faq', 'fr')).toBe('/faq')
  })

  it('retrouve le chemin français', () => {
    for (const path of ['/', '/galerie', '/activites', '/activites/tandem', '/faq', '/discord'])
      expect(delocalizePath(localizePath(path, 'en'))).toBe(path)
    expect(delocalizePath('/faq')).toBe('/faq')
  })
})
