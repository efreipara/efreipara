// Remplace chaque {clé} du libellé par sa valeur : « Pourquoi choisir {label} ? »
export const fillLabel = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.hasOwn(values, key) ? String(values[key]) : match,
  )

// « 1 doc », « 3 docs »
export const countLabel = (count: number, forms: { one: string; other: string }) =>
  `${count} ${count > 1 ? forms.other : forms.one}`
