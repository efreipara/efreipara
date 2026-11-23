// Saison de global/seasons.yml : période MM-JJ incluse, répétée chaque année
export interface SeasonPeriod {
  start: string
  end: string
}

const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export const isMonthDay = (value: string) => {
  const match = /^(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false
  const month = Number(match[1])
  const day = Number(match[2])
  return month >= 1 && month <= 12 && day >= 1 && day <= DAYS_IN_MONTH[month - 1]!
}

const monthDay = (date: Date) =>
  `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

// Une période dont le début suit la fin passe le 31 décembre (12-20 → 01-05)
export const isInSeason = (season: SeasonPeriod, today: Date = new Date()) => {
  const day = monthDay(today)
  return season.start <= season.end
    ? day >= season.start && day <= season.end
    : day >= season.start || day <= season.end
}

// Première saison qui contient le jour (heure locale du visiteur)
export const activeSeason = <T extends SeasonPeriod>(items: T[], today: Date = new Date()) =>
  items.find((season) => isInSeason(season, today)) ?? null
