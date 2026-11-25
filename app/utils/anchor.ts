// `Organisation & logistique` → `organisation--logistique` (ancres des catégories)
export const toAnchorId = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

// Position de défilement où une ancre s'arrête : sous son scroll-mt, bornée par le haut et le
// bas de la page (une ancre trop basse ne peut pas monter jusqu'en haut de l'écran)
export const scrollDestination = (
  scrollY: number,
  { top, margin, maxScroll }: { top: number; margin: number; maxScroll: number },
) => Math.min(Math.max(scrollY + top - margin, 0), maxScroll)

// Arrivée à destination, à un pixel près (positions fractionnaires)
export const isAtDestination = (
  scrollY: number,
  target: { top: number; margin: number; maxScroll: number },
) => Math.abs(scrollDestination(scrollY, target) - scrollY) < 2
