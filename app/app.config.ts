export default defineAppConfig({
  ui: {
    colors: {
      primary: 'navy',
      secondary: 'blue',
      neutral: 'slate',
    },
    // Retour à l'appui sur tous les boutons ; `transition` inclut scale (Nuxt UI : transition-colors)
    button: {
      slots: {
        base: 'transition active:scale-[0.97]',
      },
    },
    // Toutes les UPageSection (SharedSection) : surtitre en capitales, titre Racing Sans One
    // aligné à gauche (le centrage par défaut de Nuxt UI fait « template »), un seul rythme vertical
    pageSection: {
      slots: {
        container: 'py-12 sm:py-20 lg:py-24 gap-10 sm:gap-12',
        headline:
          'text-primary mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase',
        title: 'font-title text-3xl tracking-normal sm:text-4xl lg:text-4xl',
        description: 'max-w-2xl text-pretty',
        body: 'mt-10',
      },
      variants: {
        orientation: {
          vertical: {
            headline: 'justify-start',
            leading: 'justify-start',
            title: 'text-left',
            description: 'text-left text-pretty',
            links: 'justify-start',
          },
        },
      },
    },
    // Icônes génériques NuxtUI : surchargées en Tabler dans nuxt.config.ts (appConfig.ui.icons),
    // Elles restent accessibles ici via useAppConfig() (fusion des deux sources au runtime).
  },
})
