export default defineAppConfig({
  ui: {
    colors: {
      primary: 'black',
      secondary: 'blue',
      neutral: 'slate',
    },
    icons: {
      // Icônes génériques utilisées dans l'interface (NuxtUI)
      arrowDown: 'i-tabler-arrow-down',
      arrowLeft: 'i-tabler-arrow-left',
      arrowRight: 'i-tabler-arrow-right',
      arrowUp: 'i-tabler-arrow-up',
      caution: 'i-tabler-alert-square-rounded',
      check: 'i-tabler-check',
      chevronDoubleLeft: 'i-tabler-chevrons-left',
      chevronDoubleRight: 'i-tabler-chevrons-right',
      chevronDown: 'i-tabler-chevron-down',
      chevronLeft: 'i-tabler-chevron-left',
      chevronRight: 'i-tabler-chevron-right',
      chevronUp: 'i-tabler-chevron-up',
      close: 'i-tabler-x',
      copy: 'i-tabler-copy',
      copyCheck: 'i-tabler-copy-check',
      dark: 'i-tabler-moon',
      drag: 'i-tabler-grip-vertical',
      ellipsis: 'i-tabler-dots',
      error: 'i-tabler-square-rounded-x',
      external: 'i-tabler-external-link',
      eye: 'i-tabler-eye',
      eyeOff: 'i-tabler-eye-off',
      file: 'i-tabler-file',
      folder: 'i-tabler-folder',
      folderOpen: 'i-tabler-folder-open',
      hash: 'i-tabler-hash',
      info: 'i-tabler-info-square-rounded',
      light: 'i-tabler-sun',
      loading: 'i-tabler-loader-2',
      menu: 'i-tabler-menu',
      minus: 'i-tabler-minus',
      panelClose: 'i-tabler-layout-sidebar-left-collapse',
      panelOpen: 'i-tabler-layout-sidebar-left-expand',
      plus: 'i-tabler-plus',
      reload: 'i-tabler-reload',
      search: 'i-tabler-search',
      stop: 'i-tabler-player-stop',
      success: 'i-tabler-square-rounded-check',
      system: 'i-tabler-device-desktop',
      tip: 'i-tabler-bulb',
      upload: 'i-tabler-upload',
      warning: 'i-tabler-alert-triangle',
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
        parachute: 'i-tabler-parachute',
        oa: 'i-tabler-parachute',
        tandem: 'i-tabler-users',
        soufflerie: 'i-tabler-wind',
        pac: 'i-tabler-medal-2',
      },
      navigation: {
        document: 'i-tabler-file',
        galeries: 'i-tabler-camera',
      },
      rejoindre: {
        rejoindre: 'i-tabler-user-plus',
        devenirMembre: 'i-tabler-users-group',
        rejoindreBureau: 'i-tabler-crown',
        // Icônes de la section "Pourquoi nous rejoindre ?"
        whyActivites: 'i-tabler-parachute',
        whyCommunaute: 'i-tabler-users',
        whySouvenirs: 'i-tabler-star',
      },
      contact: {
        email: 'i-tabler-mail',
        phone: 'i-tabler-phone',
        mapPin: 'i-tabler-map-pin',
        support: 'i-tabler-tool',
        socialNetworks: 'i-tabler-share',
        // Liens vers les applications de cartographie
        googleMaps: 'i-simple-icons-googlemaps',
        apple: 'i-simple-icons-apple',
        waze: 'i-simple-icons-waze',
      },
      extras: {
        arrowNarrowRight: 'i-tabler-arrow-narrow-right',
        caretDownFilled: 'i-tabler-caret-down-filled',
        calendar: 'i-tabler-calendar-week',
        closeCircle: 'i-tabler-circle-x',
        question: 'i-tabler-question-mark',
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
      icon: 'i-simple-icons-discord',
      url: 'https://discord.gg/mYKagj9XR3',
    },
    instagram: {
      icon: 'i-simple-icons-instagram',
      url: 'https://instagram.com/efreipara',
    },
    linkedin: {
      icon: 'i-simple-icons-linkedin',
      url: 'https://linkedin.com/company/efrei-para',
    },
    bento: {
      icon: 'i-simple-icons-bento',
      url: 'https://karde.me/efreipara',
    },
    github: {
      icon: 'i-simple-icons-github',
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
