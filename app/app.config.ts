const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverted'
// Trait des surtitres sous le libellé, qui s'étire au survol ; au repos, largeur de l'icône de
// tête (réglée par taille dans compoundVariants), bouts presque droits pour qu'il la couvre
const underlineBar = `relative after:absolute after:bottom-0.5 after:left-0.5 after:h-0.5 after:w-5 after:rounded-[0.5px] after:bg-current after:transition-[width] after:duration-200 after:ease-[cubic-bezier(0.23,1,0.32,1)] hover:after:w-[calc(100%-0.25rem)] motion-reduce:after:transition-none ${focusRing}`

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'navy',
      secondary: 'blue',
      neutral: 'slate',
    },
    // Retour à l'appui sur tous les boutons ; `transition` inclut scale (Nuxt UI : transition-colors).
    // Rôles du site (docs/DESIGN_SYSTEM.md) : primary, secondary, tertiary, utility, filter ;
    // boutons d'icône en ghost. Le principal et les filtres sont inclinés, leur contenu redressé.
    button: {
      slots: {
        base: 'cursor-pointer justify-center transition active:scale-[0.97]',
      },
      variants: {
        variant: {
          primary: `font-title -skew-x-12 bg-inverted font-normal tracking-normal text-inverted hover:bg-inverted/85 *:skew-x-12 ${focusRing}`,
          secondary: `font-semibold text-highlighted ${underlineBar}`,
          tertiary: `text-muted hover:text-highlighted ${underlineBar}`,
          utility: `ring ring-inverted/30 text-highlighted ring-inset hover:bg-elevated ${focusRing}`,
          filter: `-skew-x-12 rounded-[5px] ring ring-inverted/30 text-highlighted ring-inset hover:bg-elevated *:skew-x-12 aria-pressed:bg-inverted aria-pressed:text-inverted aria-pressed:ring-0 ${focusRing}`,
        },
      },
      compoundVariants: [
        { variant: 'primary', size: ['xs', 'sm'], class: 'px-3.5 text-sm' },
        { variant: 'primary', size: ['md', 'lg'], class: 'px-5 text-base' },
        { variant: 'primary', size: 'xl', class: 'px-6 text-lg' },
        // Racing Sans One dessine ses lettres bas dans la ligne : libellé remonté d'environ 1 px
        { variant: 'primary', class: { label: '-translate-y-[0.06em]' } },
        { variant: ['secondary', 'tertiary'], class: 'px-0.5' },
        { variant: ['secondary', 'tertiary'], size: ['xs', 'sm'], class: 'after:w-4' },
        { variant: ['secondary', 'tertiary'], size: 'xl', class: 'after:w-6' },
        { variant: 'filter', class: { base: 'px-3.5 text-sm', leadingIcon: 'size-4' } },
      ],
    },
    // Toutes les UPageSection (SharedSection) : surtitre en capitales, titre Racing Sans One
    // aligné à gauche (le centrage par défaut de Nuxt UI fait « template »), un seul rythme vertical
    pageSection: {
      slots: {
        container: 'py-12 sm:py-20 lg:py-24 gap-10 sm:gap-12',
        headline: 'mb-3',
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
    // En-tête des pages intérieures (SharedPageHero) : même surtitre et titre que les sections
    pageHeader: {
      slots: {
        root: 'border-b-0 py-12 sm:py-16',
        headline: 'mb-3',
        title: 'font-title text-4xl tracking-normal sm:text-5xl',
        description: 'max-w-2xl text-pretty',
      },
    },
    // Icônes génériques NuxtUI : surchargées en Tabler dans nuxt.config.ts (appConfig.ui.icons),
    // Elles restent accessibles ici via useAppConfig() (fusion des deux sources au runtime).
  },
})
