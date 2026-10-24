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

  efreipara: {
    icons: {
      activites: {
        parachute: 'tabler:parachute',
      },
      navigation: {
        document: 'tabler:file-description',
        galerie: 'tabler:camera',
      },
      rejoindre: {
        rejoindre: 'tabler:user-plus',
      },
      contact: {
        email: 'tabler:mail',
        phone: 'tabler:phone',
        mapPin: 'tabler:map-pin',
        support: 'tabler:tool',
        socialNetworks: 'tabler:share',
        // Liens vers les applications de cartographie
        googleMaps: 'simple-icons:googlemaps',
        apple: 'simple-icons:apple',
        waze: 'simple-icons:waze',
      },
      extras: {
        accessibility: 'tabler:accessible',
        accessibilityFilled: 'tabler:accessible-filled',
        arrowNarrowRight: 'tabler:arrow-narrow-right',
        caretDownFilled: 'tabler:caret-down-filled',
        calendar: 'tabler:calendar-week',
        closeCircle: 'tabler:circle-x',
        maximize: 'tabler:maximize',
        minimize: 'tabler:minimize',
        question: 'tabler:question-mark',
      },
    },

    colors: {
      oa: {
        root: 'bg-efreipara-oa',
        icon: 'text-on-efreipara-oa',
        title: 'text-on-efreipara-oa',
        close:
          'text-on-efreipara-oa hover:bg-on-efreipara-oa/10 focus-visible:bg-on-efreipara-oa/10',
      },
      tandem: {
        root: 'bg-efreipara-tandem',
        icon: 'text-on-efreipara-tandem',
        title: 'text-on-efreipara-tandem',
        close:
          'text-on-efreipara-tandem hover:bg-on-efreipara-tandem/10 focus-visible:bg-on-efreipara-tandem/10',
      },
      soufflerie: {
        root: 'bg-efreipara-soufflerie',
        icon: 'text-on-efreipara-soufflerie',
        title: 'text-on-efreipara-soufflerie',
        close:
          'text-on-efreipara-soufflerie hover:bg-on-efreipara-soufflerie/10 focus-visible:bg-on-efreipara-soufflerie/10',
      },
      pac: {
        root: 'bg-efreipara-pac',
        icon: 'text-on-efreipara-pac',
        title: 'text-on-efreipara-pac',
        close:
          'text-on-efreipara-pac hover:bg-on-efreipara-pac/10 focus-visible:bg-on-efreipara-pac/10',
      },
    },
  },

  socials: {
    discord: {
      icon: 'simple-icons:discord',
      iconColor: 'text-discord',
      url: 'https://discord.gg/mYKagj9XR3',
    },
    instagram: {
      icon: 'simple-icons:instagram',
      iconColor: 'text-instagram',
      url: 'https://instagram.com/efreipara',
    },
    linkedin: {
      icon: 'simple-icons:linkedin',
      url: 'https://linkedin.com/company/efrei-para',
    },
    bento: {
      icon: 'simple-icons:bento',
      url: 'https://karde.me/efreipara',
    },
    github: {
      icon: 'simple-icons:github',
      url: 'https://github.com/efreipara',
      repo: 'https://github.com/efreipara/efreipara',
      issues: 'https://github.com/efreipara/efreipara/issues/new',
    },
  },

  contact: {
    email: 'efrei-para@groupe-efrei.net',
    address: 'Efrei, 30-32 Avenue de la République, 94800 Villejuif',
    mapUrls: {
      google:
        'https://www.google.com/maps/search/?api=1&query=Efrei%2C+30-32+Avenue+de+la+R%C3%A9publique%2C+94800+Villejuif',
      apple: 'https://maps.apple.com/?q=Efrei,30-32+Avenue+de+la+République,94800+Villejuif',
      waze: 'https://waze.com/ul?q=Efrei%2C+30-32+Avenue+de+la+R%C3%A9publique%2C+94800+Villejuif&navigate=yes',
    },
    maintainer: {
      email: 'support.efreipara@loye.fr',
    },
  },
})
