import { describe, expect, it } from 'vitest'
import { buildLlmsText, type LlmsData } from '../../app/utils/llms'

const item = (title: string) => ({ title, description: `${title}, en détail` })

const data = (overrides: Partial<LlmsData> = {}): LlmsData => ({
  seo: {
    defaults: { siteName: 'Efrei Para', baseUrl: 'https://efreipara.fr' },
    pages: { index: { title: 'Efrei Para', description: 'Défie la gravité' } },
  } as LlmsData['seo'],
  home: {
    about: { paragraphs: ['Le club de parachutisme'] },
    why: { title: 'Pourquoi Efrei Para ?', items: [item('Accessible')] },
    events: { title: 'Prochains événements' },
    partners: { title: 'Nos partenaires' },
  },
  activitesIndex: { hero: { title: 'Nos activités', description: 'Quatre façons de voler' } },
  activites: [
    { stem: 'pages/activites/oa', title: 'Saut en OA', label: 'OA', description: 'Seul' },
    {
      stem: 'pages/activites/tandem',
      title: 'Saut en tandem',
      label: 'Tandem',
      description: 'En binôme',
      stats: [{ value: '4 000 m', label: 'Altitude' }],
      features: [item('Rush')],
      steps: [item('Départ'), item('Saut')],
      requirements: [{ label: '15 ans minimum' }],
    },
  ],
  labels: {
    activity: {
      features: 'Pourquoi choisir {label} ?',
      steps: 'Déroulé',
      requirements: 'Prérequis',
    },
    events: { or: 'ou' },
  },
  rejoindre: {
    hero: { title: 'Rejoins Efrei Para', description: 'Une place pour toi' },
    alert: item('Discord'),
    options: [{ ...item('Devenir membre'), link: 'https://forms.gle/x', linkText: 'Formulaire' }],
  },
  events: {
    items: [
      { title: 'Saut en tandem', months: ['2027-05', '2027-06'], type: 'tandem' },
      {
        title: 'Prochain saut',
        location: 'Péronne',
        date: '2026-11-02',
        type: 'tandem',
        url: 'https://forms.gle/y',
      },
    ],
  },
  faq: {
    title: 'FAQ',
    description: 'Questions',
    categories: [{ name: 'Le club', questions: [{ question: 'Payant ?', answer: 'Non.\n' }] }],
  },
  documents: {
    title: 'Documents',
    description: 'Ressources',
    categories: [{ name: 'Généraux', documents: [{ ...item('Règlement'), url: '/reglement' }] }],
  },
  galerie: { hero: { title: 'Albums', description: 'En images' } },
  partners: { items: [{ name: 'iFly', url: 'https://iflyfrance.com' }] },
  contact: {
    hero: { title: 'Nous contacter', description: 'Écris-nous' },
    email: { title: 'E-mail' },
    address: { title: 'Adresse' },
    socials: { title: 'Réseaux' },
    support: { title: 'Support', buttons: { github: 'Signaler sur GitHub', email: 'E-mail' } },
  },
  club: {
    email: 'club@example.org',
    address: 'Villejuif',
    socials: [{ name: 'Discord', url: 'https://discord.gg/x' }],
    github: { issues: 'https://github.com/efreipara/efreipara/issues/new' },
  },
  navigation: { footer: { legal: 'Légal' } },
  legal: [{ ...item('RGPD'), path: '/rgpd' }],
  ...overrides,
})

const today = new Date('2026-10-27T12:00:00')

describe('buildLlmsText', () => {
  it('commence par le nom du site et sa description', () => {
    expect(buildLlmsText(data(), today)).toMatch(/^# Efrei Para\n\n> Défie la gravité\n/)
  })

  it('range les activités dans l’ordre du site, avec leur adresse absolue', () => {
    const text = buildLlmsText(data(), today)
    expect(text.indexOf('### Saut en tandem')).toBeLessThan(text.indexOf('### Saut en OA'))
    expect(text).toContain('<https://efreipara.fr/activites/tandem>')
  })

  it('remplit les libellés et numérote le déroulé', () => {
    const text = buildLlmsText(data(), today)
    expect(text).toContain('#### Pourquoi choisir Tandem ?')
    expect(text).toContain('1. **Départ** : Départ, en détail\n2. **Saut**')
    expect(text).toContain('- 15 ans minimum')
  })

  it('omet les sections facultatives absentes', () => {
    const oa = buildLlmsText(data(), today).split('### Saut en OA')[1]!.split('\n## ')[0]
    expect(oa).not.toContain('####')
  })

  it('rend absolus les liens internes et garde les liens externes', () => {
    const text = buildLlmsText(data(), today)
    expect(text).toContain('[Règlement](https://efreipara.fr/reglement)')
    expect(text).toContain('[RGPD](https://efreipara.fr/rgpd)')
    expect(text).toContain('[Formulaire](https://forms.gle/x)')
  })

  it('liste les événements à venir, du plus proche au plus lointain', () => {
    expect(buildLlmsText(data(), today)).toContain(
      '## Prochains événements\n\n- **Prochain saut** : 2026-11-02, Péronne : https://forms.gle/y\n- **Saut en tandem** : mai ou juin\u00A02027',
    )
  })

  it('masque un événement passé, et la section sans événement', () => {
    expect(buildLlmsText(data(), new Date('2026-11-03'))).not.toContain('Prochain saut')
    expect(buildLlmsText(data({ events: null }), today)).not.toContain('Prochains événements')
  })
})
