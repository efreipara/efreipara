import { describe, expect, it } from 'vitest'
import { DEFAULT_LOCALE, LOCALE_CODES, localizePath } from '../../app/utils/locales'
import { allContentFiles, readContent } from './helpers'

// Champs qui ne se traduisent pas : identiques dans toutes les langues (dates, types, icônes,
// liens externes…) ; goalZones et changelogGoal nomment les Goals Plausible, communs aux langues
const sameKeys = new Set([
  'url',
  'link',
  'date',
  'months',
  'type',
  'icon',
  'activeIcon',
  'image',
  'photo',
  'key',
  'slug',
  'color',
  'colorDark',
  'variant',
  'imageCount',
  'ogImage',
  'robots',
  'baseUrl',
  'header',
  'target',
  'buttons',
  'headerSocials',
  'goalZones',
  'changelogGoal',
  'goal',
])
const linkKeys = new Set(['to', 'url', 'link'])

// Écarts entre un fichier traduit et son original : champ manquant, liste de longueur différente,
// champ de données modifié (goal, goalZones : noms Plausible), lien interne qui n'est pas l'adresse traduite de l'original
const differences = (source: unknown, translated: unknown, locale: string, path = ''): string[] => {
  if (Array.isArray(source)) {
    if (!Array.isArray(translated) || translated.length !== source.length)
      return [`${path} : ${source.length} éléments attendus`]
    return source.flatMap((item, i) => differences(item, translated[i], locale, `${path}[${i}]`))
  }
  if (source && typeof source === 'object') {
    if (!translated || typeof translated !== 'object') return [`${path} : absent`]
    return Object.entries(source).flatMap(([key, value]) => {
      const here = path ? `${path}.${key}` : key
      const other = (translated as Record<string, unknown>)[key]
      if (other === undefined) return [`${here} : absent`]
      if (linkKeys.has(key) && typeof value === 'string' && value.startsWith('/'))
        return other === localizePath(value, locale as never) ? [] : [`${here} : ${String(other)}`]
      // `buttons` ou `link` peuvent aussi être des objets à traduire (libellés) : on y descend
      const data =
        !value ||
        typeof value !== 'object' ||
        (Array.isArray(value) && value.every((v) => typeof v !== 'object'))
      if (sameKeys.has(key) && (data || key === 'goalZones'))
        return JSON.stringify(other) === JSON.stringify(value) ? [] : [`${here} : diffère`]
      return differences(value, other, locale, here)
    })
  }
  return []
}

describe('traductions', () => {
  for (const locale of LOCALE_CODES.filter((code) => code !== DEFAULT_LOCALE)) {
    for (const file of allContentFiles(locale)) {
      it(`${locale}/${file} suit la structure et les données du français`, () => {
        expect(differences(readContent(file), readContent(file, locale), locale)).toEqual([])
      })
    }
  }
})
