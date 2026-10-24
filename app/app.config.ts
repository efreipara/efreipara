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
    // Icônes génériques NuxtUI : surchargées en Tabler dans nuxt.config.ts (appConfig.ui.icons),
    // Elles restent accessibles ici via useAppConfig() (fusion des deux sources au runtime).
  },
})
