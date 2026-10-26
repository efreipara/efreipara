// Affiché jusqu'au jour de l'événement inclus
export const isUpcomingEvent = (date: string, today: Date = new Date()) => {
  const start = new Date(today)
  start.setHours(0, 0, 0, 0)
  const eventDate = new Date(date)
  eventDate.setHours(0, 0, 0, 0)
  return eventDate >= start
}

// Clé de fermeture de la bannière : un nouvel événement la fait réapparaître
export const eventBannerId = (event?: { date?: string; type?: string } | null) =>
  `event-${event?.date}-${event?.type}`
