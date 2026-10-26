// Site de destination d'un document : domaine sans « www. » pour un lien externe,
// undefined pour une page du site (chemin relatif) ou une adresse invalide
export const documentHost = (url: string) => {
  if (!/^https?:\/\//.test(url)) return undefined
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return undefined
  }
}
