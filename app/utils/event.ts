import { fillLabel } from './labels'
import { DEFAULT_LANGUAGE } from './locales'

// Événement de global/events.yml : `date` quand le jour est fixé, sinon `months` (AAAA-MM)
export interface EventItem {
  title: string
  location?: string
  date?: string
  months?: string[]
  type: string
  url?: string
}

// Affiché jusqu'au jour de l'événement inclus
export const isUpcomingEvent = (date: string, today: Date = new Date()) => {
  const start = new Date(today)
  start.setHours(0, 0, 0, 0)
  const eventDate = new Date(date)
  eventDate.setHours(0, 0, 0, 0)
  return eventDate >= start
}

const lastDayOfMonth = (month: string) => {
  const [year, m] = month.split('-').map(Number)
  return `${month}-${String(new Date(Date.UTC(year!, m!, 0)).getUTCDate()).padStart(2, '0')}`
}

export const eventStart = (event: EventItem) => event.date ?? `${event.months?.[0]}-01`

// Un événement sans jour fixé reste affiché jusqu'à la fin de son dernier mois possible
export const eventEnd = (event: EventItem) =>
  event.date ?? lastDayOfMonth(event.months?.at(-1) ?? '')

// À venir, du plus proche au plus lointain ; à début égal, celui qui a un jour fixé d'abord
export const upcomingEvents = <T extends EventItem>(
  items: T[],
  today: Date = new Date(),
  type?: string,
) =>
  items
    .filter((event) => (!type || event.type === type) && isUpcomingEvent(eventEnd(event), today))
    .sort((a, b) => eventStart(a).localeCompare(eventStart(b)) || Number(!a.date) - Number(!b.date))

// La bannière n'annonce qu'un événement dont le jour est fixé
export const bannerEvent = <T extends EventItem>(upcoming: T[]) =>
  upcoming.find((event): event is T & { date: string } => !!event.date)

// `language` : langue BCP 47 de la page (fr-FR par défaut)
const format = (value: string, options: Intl.DateTimeFormatOptions, language = DEFAULT_LANGUAGE) =>
  new Intl.DateTimeFormat(language, { ...options, timeZone: 'UTC' }).format(new Date(value))

// « vendredi 4 décembre », le jour et le mois jamais séparés en fin de ligne
export const formatEventDate = (date: string, language?: string) =>
  format(date, { weekday: 'long', day: 'numeric', month: 'long' }, language).replace(
    /(\d+) /,
    '$1\u00A0',
  )

// « mars 2027 », « janvier ou février 2027 », « décembre 2026 ou janvier 2027 »
export const formatEventMonths = (months: string[], or: string, language?: string) => {
  const parts = months.map((month, i) => {
    const name = format(`${month}-01`, { month: 'long' }, language)
    const year = month.slice(0, 4)
    return months[i + 1]?.slice(0, 4) === year ? name : `${name}\u00A0${year}`
  })
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} ${or} ${parts.at(-1)}` : parts[0]!
}

export const formatEventWhen = (event: EventItem, or: string, language?: string) =>
  event.date
    ? formatEventDate(event.date, language)
    : formatEventMonths(event.months ?? [], or, language)

// Pavé de date des cartes : « 4 » et « déc. »
export const eventDateParts = (date: string, language?: string) => ({
  day: format(date, { day: 'numeric' }, language),
  month: format(date, { month: 'short' }, language),
})

// « 12 mars 2026 » : date d'un album, mise à jour d'une page légale
export const formatLongDate = (date: string, language?: string) =>
  format(date, { day: 'numeric', month: 'long', year: 'numeric' }, language)

// « Baptême en soufflerie » devient « baptême en soufflerie » au milieu d'une phrase ; un sigle reste
export const lowerFirst = (text: string) =>
  /^\p{Lu}\p{Ll}/u.test(text) ? text[0]!.toLowerCase() + text.slice(1) : text

export const bannerTitle = (
  event: EventItem & { date: string },
  templates: { title: string; titleAt: string },
  language?: string,
) =>
  fillLabel(event.location ? templates.titleAt : templates.title, {
    title: lowerFirst(event.title),
    location: event.location ?? '',
    date: formatEventDate(event.date, language),
  })

// Clé de fermeture de la bannière : un nouvel événement la fait réapparaître
export const eventBannerId = (event?: { date?: string; type?: string } | null) =>
  `event-${event?.date}-${event?.type}`
