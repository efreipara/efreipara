import { describe, expect, it } from 'vitest'
import { countLabel, fillLabel } from '../../app/utils/labels'

describe('fillLabel', () => {
  it('remplace chaque {clé} par sa valeur', () => {
    expect(fillLabel('Pourquoi choisir {label} ?', { label: 'PAC' })).toBe('Pourquoi choisir PAC ?')
    expect(fillLabel('v{version}', { version: '1.4.0' })).toBe('v1.4.0')
  })

  it('laisse une clé inconnue telle quelle', () => {
    expect(fillLabel('{name} Efrei Para', {})).toBe('{name} Efrei Para')
  })
})

describe('countLabel', () => {
  it('accorde le mot au nombre', () => {
    const forms = { one: 'doc', other: 'docs' }
    expect(countLabel(1, forms)).toBe('1 doc')
    expect(countLabel(3, forms)).toBe('3 docs')
  })
})
