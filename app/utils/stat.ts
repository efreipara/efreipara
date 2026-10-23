// `100+` → { num: 100, suffix: '+' } ; sans nombre en tête, tout est suffixe
export const parseStatValue = (value: string | number) => {
  const str = String(value)
  const match = str.match(/^(\d+)(.*)$/)
  if (!match) return { num: 0, suffix: str }
  return { num: parseInt(match[1] ?? '0', 10), suffix: match[2] ?? '' }
}
