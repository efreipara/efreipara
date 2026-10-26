import { visit } from 'unist-util-visit'

// Liens externes du Markdown de Content (pages légales) : nouvel onglet, sans accès à window.opener.
// Interne = commence par / ou #.
export default function rehypeTargetBlank() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const href = node.tagName === 'a' ? node.properties?.href : undefined
      if (!href || href.startsWith('/') || href.startsWith('#')) return
      node.properties.target = '_blank'
      node.properties.rel = 'noopener noreferrer'
    })
  }
}
