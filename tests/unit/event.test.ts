import { describe, expect, it } from 'vitest'
import {
  bannerEvent,
  bannerTitle,
  eventBannerId,
  eventDateParts,
  eventEnd,
  formatEventDate,
  formatEventMonths,
  formatEventWhen,
  formatLongDate,
  isUpcomingEvent,
  lowerFirst,
  upcomingEvents,
  type EventItem,
} from '../../app/utils/event'

const today = new Date('2026-10-12T15:30:00')

const dated = (date: string, type = 'tandem'): EventItem => ({ title: 'Saut', date, type })
const inMonths = (months: string[], type = 'tandem'): EventItem => ({
  title: 'Saut',
  months,
  type,
})

describe('isUpcomingEvent', () => {
  it('affiche un événement à venir', () => {
    expect(isUpcomingEvent('2026-10-20', today)).toBe(true)
  })

  it("affiche l'événement le jour même, quelle que soit l'heure", () => {
    expect(isUpcomingEvent('2026-10-12', today)).toBe(true)
  })

  it('masque un événement passé', () => {
    expect(isUpcomingEvent('2026-10-11', today)).toBe(false)
  })
})

describe('eventEnd', () => {
  it('prend le dernier jour du dernier mois possible', () => {
    expect(eventEnd(inMonths(['2027-01', '2027-02']))).toBe('2027-02-28')
    expect(eventEnd(inMonths(['2028-02']))).toBe('2028-02-29')
  })
})

describe('upcomingEvents', () => {
  it('garde les événements à venir, du plus proche au plus lointain', () => {
    const items = [dated('2026-12-04'), dated('2026-10-01'), inMonths(['2026-11'])]
    expect(upcomingEvents(items, today).map((e) => e.date ?? e.months?.[0])).toEqual([
      '2026-11',
      '2026-12-04',
    ])
  })

  it('garde un événement en mois jusqu’à la fin de son dernier mois', () => {
    expect(upcomingEvents([inMonths(['2026-09', '2026-10'])], today)).toHaveLength(1)
    expect(upcomingEvents([inMonths(['2026-09'])], today)).toHaveLength(0)
  })

  it('place le jour fixé avant les mois qui commencent le même jour', () => {
    const items = [inMonths(['2026-11']), dated('2026-11-01')]
    expect(upcomingEvents(items, today)[0]?.date).toBe('2026-11-01')
  })

  it('filtre par activité', () => {
    const items = [dated('2026-12-04', 'soufflerie'), dated('2026-12-05', 'tandem')]
    expect(upcomingEvents(items, today, 'soufflerie').map((e) => e.type)).toEqual(['soufflerie'])
  })

  it('accepte une liste vide', () => {
    expect(upcomingEvents([], today)).toEqual([])
  })
})

describe('bannerEvent', () => {
  it('ignore les événements sans jour fixé', () => {
    expect(bannerEvent([inMonths(['2026-11']), dated('2026-12-04')])?.date).toBe('2026-12-04')
    expect(bannerEvent([inMonths(['2026-11'])])).toBeUndefined()
  })
})

describe('formatEventDate', () => {
  it('écrit le jour de la semaine, le jour et le mois, insécables entre eux', () => {
    expect(formatEventDate('2026-12-04')).toBe('vendredi 4\u00A0décembre')
  })

  it('ne décale pas la date selon le fuseau', () => {
    expect(formatEventDate('2027-01-01')).toBe('vendredi 1\u00A0janvier')
  })

  it('écrit la date dans la langue demandée', () => {
    expect(formatEventDate('2026-12-04', 'en-US')).toBe('Friday, December 4')
  })
})

describe('formatLongDate', () => {
  it('écrit le jour, le mois et l’année, en français par défaut', () => {
    expect(formatLongDate('2026-03-12')).toBe('12 mars 2026')
    expect(formatLongDate('2026-03-12', 'en-GB')).toBe('12 March 2026')
  })
})

describe('formatEventMonths', () => {
  it('écrit un, deux ou trois mois', () => {
    expect(formatEventMonths(['2027-03'], 'ou')).toBe('mars\u00A02027')
    expect(formatEventMonths(['2027-01', '2027-02'], 'ou')).toBe('janvier ou février\u00A02027')
    expect(formatEventMonths(['2027-01', '2027-02', '2027-03'], 'ou')).toBe(
      'janvier, février ou mars\u00A02027',
    )
  })

  it("répète l'année quand elle change", () => {
    expect(formatEventMonths(['2026-12', '2027-01'], 'ou')).toBe(
      'décembre\u00A02026 ou janvier\u00A02027',
    )
  })
})

describe('formatEventWhen', () => {
  it('écrit le jour fixé, sinon les mois possibles', () => {
    expect(formatEventWhen(dated('2026-12-04'), 'ou')).toBe('vendredi 4\u00A0décembre')
    expect(formatEventWhen(inMonths(['2027-05', '2027-06']), 'ou')).toBe('mai ou juin\u00A02027')
  })
})

describe('eventDateParts', () => {
  it('donne le jour et le mois abrégé', () => {
    expect(eventDateParts('2026-12-04')).toEqual({ day: '4', month: 'déc.' })
  })
})

describe('lowerFirst', () => {
  it('met en minuscule un mot ordinaire, pas un sigle', () => {
    expect(lowerFirst('Baptême en soufflerie')).toBe('baptême en soufflerie')
    expect(lowerFirst('PAC niveau 1')).toBe('PAC niveau 1')
    expect(lowerFirst('OA')).toBe('OA')
  })
})

describe('bannerTitle', () => {
  const templates = {
    title: 'Prochain événement : {title} le {date}',
    titleAt: 'Prochain événement : {title} à {location} le {date}',
  }

  it('écrit le lieu quand il est connu', () => {
    const event = {
      title: 'Baptême en soufflerie',
      location: 'iFly Paris',
      date: '2026-12-04',
      type: 'soufflerie',
    }
    expect(bannerTitle(event, templates)).toBe(
      'Prochain événement : baptême en soufflerie à iFly Paris le vendredi 4\u00A0décembre',
    )
  })

  it('se passe du lieu', () => {
    expect(
      bannerTitle({ title: 'Saut en tandem', date: '2027-05-15', type: 'tandem' }, templates),
    ).toBe('Prochain événement : saut en tandem le samedi 15\u00A0mai')
  })
})

describe('eventBannerId', () => {
  it('dépend de la date et du type', () => {
    expect(eventBannerId({ date: '2026-10-12', type: 'tandem' })).toBe('event-2026-10-12-tandem')
  })

  it("change quand l'événement change", () => {
    expect(eventBannerId({ date: '2026-10-12', type: 'tandem' })).not.toBe(
      eventBannerId({ date: '2026-11-05', type: 'tandem' }),
    )
  })
})
