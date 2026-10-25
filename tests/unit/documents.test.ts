import { describe, expect, it } from 'vitest'
import { documentHost } from '../../app/utils/documents'

describe('documentHost', () => {
  it('donne le domaine d’un lien externe, sans « www. »', () => {
    expect(documentHost('https://www.ffp.asso.fr/espace-medical/')).toBe('ffp.asso.fr')
    expect(documentHost('https://drive.google.com/file/d/abc/view')).toBe('drive.google.com')
  })

  it('ne donne rien pour une page du site ou une adresse invalide', () => {
    expect(documentHost('/reglement')).toBeUndefined()
    expect(documentHost('https://')).toBeUndefined()
  })
})
