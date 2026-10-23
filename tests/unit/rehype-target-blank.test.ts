import { describe, expect, it } from 'vitest'
import rehypeTargetBlank from '../../rehype-target-blank.mjs'

const link = (href: string) => ({
  type: 'element',
  tagName: 'a',
  properties: { href } as Record<string, string>,
  children: [],
})

const run = (...links: ReturnType<typeof link>[]) => {
  const tree = { type: 'root', children: links }
  rehypeTargetBlank()(tree)
  return links
}

describe('rehypeTargetBlank', () => {
  it('ouvre un lien externe dans un nouvel onglet, avec rel', () => {
    const [external] = run(link('https://example.org'))
    expect(external!.properties).toMatchObject({
      target: '_blank',
      rel: 'noopener noreferrer',
    })
  })

  it('laisse les liens internes et les ancres dans le même onglet', () => {
    const [internal, anchor] = run(link('/reglement'), link('#article-2'))
    expect(internal!.properties.target).toBeUndefined()
    expect(anchor!.properties.target).toBeUndefined()
  })

  it('traite aussi un mailto comme externe', () => {
    const [mail] = run(link('mailto:club@example.org'))
    expect(mail!.properties.target).toBe('_blank')
  })
})
