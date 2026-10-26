// Pages de l'en-tête : celles qui ont un champ `header`, triées par sa valeur
export const sortHeaderLinks = <T extends { header?: number }>(pages: T[]) =>
  pages
    .filter((page) => page.header !== undefined)
    .sort((a, b) => (a.header ?? 0) - (b.header ?? 0))
