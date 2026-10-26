// `Organisation & logistique` → `organisation--logistique` (ancres des catégories)
export const toAnchorId = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
