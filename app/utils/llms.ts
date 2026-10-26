import { orderActivities } from './activities'
import { isUpcomingEvent } from './event'
import { fillLabel } from './labels'
import type { SeoData } from './seo'

// Champs du contenu repris dans /llms.txt : structure des collections, réduite à ce qui est lu
interface Item {
  title: string
  description: string
}

interface Activity {
  stem: string
  title: string
  label: string
  description: string
  intro?: string[]
  stats?: { value: string; label: string }[]
  features?: Item[]
  steps?: Item[]
  requirements?: { label: string; description?: string }[]
}

export interface LlmsData {
  seo: SeoData
  home: {
    about: { paragraphs: string[] }
    why: { title: string; items: Item[] }
    partners: { title: string }
  }
  activitesIndex: { hero: { title: string; description: string } }
  activites: Activity[]
  labels: { activity: { features: string; steps: string; requirements: string } }
  rejoindre: {
    hero: { title: string; description: string }
    alert: Item
    options: (Item & { link: string; linkText: string })[]
  }
  nextEvent?: { title: string; date: string; url: string } | null
  faq: {
    title: string
    description: string
    categories: { name: string; questions: { question: string; answer: string }[] }[]
  }
  documents: {
    title: string
    description: string
    categories: { name: string; documents: (Item & { url: string })[] }[]
  }
  galerie: { hero: { title: string; description: string } }
  partners: { items: { name: string; url: string }[] }
  contact: {
    hero: { title: string; description: string }
    email: { title: string }
    address: { title: string }
    socials: { title: string }
    support: { title: string; buttons: { github: string; email: string } }
  }
  club: {
    email: string
    address: string
    socials: { name: string; url: string }[]
    github: { issues: string }
  }
  navigation: { footer: { legal: string } }
  legal: (Item & { path: string })[]
}

const list = (lines: string[]) => lines.map((line) => `- ${line}`).join('\n')

const items = (entries: { title: string; description?: string }[]) =>
  list(
    entries.map(({ title, description }) =>
      description ? `**${title}** : ${description}` : title,
    ),
  )

// Sections vides retirées : un champ facultatif absent ne laisse pas de titre orphelin
const join = (blocks: (string | false | undefined)[]) => blocks.filter(Boolean).join('\n\n')

// Version Markdown du site pour les agents d'IA (https://llmstxt.org), servie en /llms.txt
export const buildLlmsText = (data: LlmsData, today: Date = new Date()) => {
  const { defaults, pages } = data.seo
  const url = (path: string) => (/^https?:\/\//.test(path) ? path : `${defaults.baseUrl}${path}`)
  const link = (label: string, path: string) => `[${label}](${url(path)})`
  const pageUrl = (path: string) => `<${url(path)}>`

  const activities = orderActivities(data.activites).map((activity) =>
    join([
      `### ${activity.title}`,
      pageUrl(activity.to),
      activity.description,
      activity.intro?.join('\n\n'),
      !!activity.stats?.length &&
        list(activity.stats.map((stat) => `**${stat.value}** : ${stat.label}`)),
      !!activity.features?.length &&
        `#### ${fillLabel(data.labels.activity.features, { label: activity.label })}\n\n${items(activity.features)}`,
      !!activity.steps?.length &&
        `#### ${data.labels.activity.steps}\n\n${activity.steps
          .map((step, i) => `${i + 1}. **${step.title}** : ${step.description}`)
          .join('\n')}`,
      !!activity.requirements?.length &&
        `#### ${data.labels.activity.requirements}\n\n${items(
          activity.requirements.map((r) => ({ title: r.label, description: r.description })),
        )}`,
    ]),
  )

  const event =
    data.nextEvent && isUpcomingEvent(data.nextEvent.date, today)
      ? `## ${data.nextEvent.title}\n\n${data.nextEvent.date} : ${url(data.nextEvent.url)}`
      : undefined

  const { contact, club } = data

  return (
    join([
      `# ${defaults.siteName}`,
      `> ${pages.index?.description ?? ''}`,
      data.home.about.paragraphs.join('\n\n'),
      `## ${data.home.why.title}\n\n${items(data.home.why.items)}`,
      join([
        `## ${data.activitesIndex.hero.title}`,
        pageUrl('/activites'),
        data.activitesIndex.hero.description,
        ...activities,
      ]),
      event,
      join([
        `## ${data.rejoindre.hero.title}`,
        pageUrl('/rejoindre'),
        data.rejoindre.hero.description,
        `**${data.rejoindre.alert.title}** : ${data.rejoindre.alert.description}`,
        list(
          data.rejoindre.options.map(
            (option) =>
              `**${option.title}** : ${option.description} ${link(option.linkText, option.link)}`,
          ),
        ),
      ]),
      join([
        `## ${data.faq.title}`,
        pageUrl('/faq'),
        data.faq.description,
        ...data.faq.categories.map((category) =>
          join([
            `### ${category.name}`,
            ...category.questions.map((q) => `**${q.question}**\n\n${q.answer.trim()}`),
          ]),
        ),
      ]),
      join([
        `## ${data.documents.title}`,
        pageUrl('/documents'),
        data.documents.description,
        ...data.documents.categories.map(
          (category) =>
            `### ${category.name}\n\n${list(
              category.documents.map((doc) => `${link(doc.title, doc.url)} : ${doc.description}`),
            )}`,
        ),
      ]),
      join([`## ${data.galerie.hero.title}`, pageUrl('/galerie'), data.galerie.hero.description]),
      `## ${data.home.partners.title}\n\n${list(
        data.partners.items.map((partner) => link(partner.name, partner.url)),
      )}`,
      join([
        `## ${contact.hero.title}`,
        pageUrl('/contact'),
        contact.hero.description,
        list([
          `**${contact.email.title}** : ${club.email}`,
          `**${contact.address.title}** : ${club.address}`,
          `**${contact.socials.title}** : ${club.socials.map((s) => link(s.name, s.url)).join(', ')}`,
          `**${contact.support.title}** : ${link(contact.support.buttons.github, club.github.issues)}`,
        ]),
      ]),
      `## ${data.navigation.footer.legal}\n\n${list(
        data.legal.map((page) => `${link(page.title, page.path)} : ${page.description}`),
      )}`,
    ]) + '\n'
  )
}
