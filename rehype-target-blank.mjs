import { visit } from 'unist-util-visit'

/**
 * Plugin rehype personnalisé pour ouvrir les liens externes dans un nouvel onglet
 * Ajoute automatiquement target="_blank" et rel="noopener noreferrer" aux liens externes
 * Les liens internes (commençant par / ou #) restent dans le même onglet
 * Uniquement sur les pages légales utilisant Nuxt Content
 */
export default function rehypeTargetBlank() {
  return (tree) => {
    // Parcourt tous les éléments de l'arbre syntaxique
    visit(tree, 'element', (node) => {
      // Si c'est un lien (balise <a>) avec un href
      if (node.tagName === 'a' && node.properties && node.properties.href) {
        const href = node.properties.href

        // Vérifie si c'est un lien externe
        // Un lien est considéré comme interne s'il :
        // - commence par / (lien relatif)
        // - commence par # (ancre)
        const isInternalLink = href.startsWith('/') || href.startsWith('#')

        // N'applique target="_blank" que pour les liens externes
        if (!isInternalLink) {
          node.properties.target = '_blank' // Ouvrir dans un nouvel onglet
          node.properties.rel = 'noopener noreferrer' // Sécurité contre les attaques de tabnabbing
        }
      }
    })
  }
}
