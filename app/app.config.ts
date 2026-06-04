export default defineAppConfig({
  ui: {
    colors: {
      primary: 'black',
      secondary: 'blue',
      neutral: 'slate',
    },
    icons: {
      // Icônes génériques utilisées dans l'interface (NuxtUI)
      accessibility: 'tabler:accessible',
      accessibilityFilled: 'tabler:accessible-filled',
      accessibilityOff: 'tabler:accessible-off',
      arrowDown: 'tabler:arrow-down',
      arrowLeft: 'tabler:arrow-left',
      arrowRight: 'tabler:arrow-right',
      arrowUp: 'tabler:arrow-up',
      caution: 'tabler:alert-square-rounded',
      check: 'tabler:check',
      chevronDoubleLeft: 'tabler:chevrons-left',
      chevronDoubleRight: 'tabler:chevrons-right',
      chevronDown: 'tabler:chevron-down',
      chevronLeft: 'tabler:chevron-left',
      chevronRight: 'tabler:chevron-right',
      chevronUp: 'tabler:chevron-up',
      close: 'tabler:x',
      copy: 'tabler:copy',
      copyCheck: 'tabler:copy-check',
      dark: 'tabler:moon',
      drag: 'tabler:grip-vertical',
      ellipsis: 'tabler:dots',
      error: 'tabler:square-rounded-x',
      external: 'tabler:external-link',
      eye: 'tabler:eye',
      eyeOff: 'tabler:eye-off',
      file: 'tabler:file',
      folder: 'tabler:folder',
      folderOpen: 'tabler:folder-open',
      hash: 'tabler:hash',
      info: 'tabler:info-square-rounded',
      light: 'tabler:sun',
      loading: 'tabler:loader-2',
      menu: 'tabler:menu-2',
      minus: 'tabler:minus',
      panelClose: 'tabler:layout-sidebar-left-collapse',
      panelOpen: 'tabler:layout-sidebar-left-expand',
      plus: 'tabler:plus',
      reload: 'tabler:reload',
      search: 'tabler:search',
      stop: 'tabler:player-stop',
      success: 'tabler:square-rounded-check',
      system: 'tabler:device-desktop',
      tip: 'tabler:bulb',
      upload: 'tabler:upload',
      warning: 'tabler:alert-triangle',
    },
    footerColumns: {
      slots: {
        root: 'lg:grid lg:grid-cols-2 lg:gap-8 xl:grid-cols-2 xl:gap-8',
        left: 'mb-10 lg:mb-0',
        center:
          'flex flex-col md:grid grid-flow-col auto-cols-fr gap-8 md:col-span-2 lg:col-span-2 text-center md:text-left',
        right: 'mt-10 lg:mt-0',
        label: 'text-sm font-semibold',
        list: 'mt-6 space-y-4',
        item: 'relative',
        link: 'group text-sm flex items-center justify-center md:justify-start gap-1.5 focus-visible:outline-primary',
        linkLeadingIcon: 'size-5 shrink-0',
        linkLabel: 'truncate',
        linkLabelExternalIcon: 'size-3 absolute top-0 text-dimmed inline-block',
      },
    },
  },

  efreipara: {
    icons: {
      activites: {
        parachute: 'tabler:parachute',
        oa: 'tabler:parachute',
        tandem: 'tabler:users',
        soufflerie: 'tabler:wind',
        pac: 'tabler:medal-2',
      },
      navigation: {
        document: 'tabler:file',
        galeries: 'tabler:camera',
      },
      rejoindre: {
        rejoindre: 'tabler:user-plus',
        devenirMembre: 'tabler:users-group',
        rejoindreBureau: 'tabler:crown',
        // Icônes de la section "Pourquoi nous rejoindre ?"
        whyActivites: 'tabler:parachute',
        whyCommunaute: 'tabler:users',
        whySouvenirs: 'tabler:star',
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
        arrowNarrowRight: 'tabler:arrow-narrow-right',
        caretDownFilled: 'tabler:caret-down-filled',
        calendar: 'tabler:calendar-week',
        closeCircle: 'tabler:circle-x',
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
      url: 'https://discord.gg/mYKagj9XR3',
    },
    instagram: {
      icon: 'simple-icons:instagram',
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
    },
  },

  contact: {
    email: 'contact@efreipara.fr',
    url: 'mailto:contact@efreipara.fr',
    address: 'Efrei, 30-32 Avenue de la République, 94800 Villejuif',
    mapUrls: {
      google:
        'https://www.google.com/maps/search/?api=1&query=Efrei%2C+30-32+Avenue+de+la+R%C3%A9publique%2C+94800+Villejuif',
      apple: 'https://maps.apple.com/?q=Efrei,30-32+Avenue+de+la+République,94800+Villejuif',
      waze: 'https://waze.com/ul?q=Efrei%2C+30-32+Avenue+de+la+R%C3%A9publique%2C+94800+Villejuif&navigate=yes',
    },
    maintainer: {
      email: 'support.efreipara@loye.fr',
      url: 'mailto:support.efreipara@loye.fr',
    },
  },
})
