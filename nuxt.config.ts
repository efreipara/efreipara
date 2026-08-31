// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import rehypeTargetBlank from './rehype-target-blank.mjs'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-19',
  ssr: true, // Nuxt content a besoin du SSR
  devtools: { enabled: true },
  vite: {
    // Minification avec Oxc (défaut Vite 8) : suppression des console.log, debugger et commentaires légaux en production
    build: {
      cssMinify: true,
      rolldownOptions: {
        output: {
          comments: { legal: false },
          minify: {
            compress: {
              dropConsole: true,
              dropDebugger: true,
            },
          },
        },
      },
    },
    // Optimisation des dépendances pour éviter les problèmes de compatibilité avec les modules externes
    optimizeDeps: {
      include: [
        '@plausible-analytics/tracker',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'isomorphic-dompurify',
        'marked',
      ],
    },
  },

  // Alias pour le plugin rehype qui ouvre les liens externes dans un nouvel onglet
  alias: {
    'rehype-target-blank': fileURLToPath(new URL('./rehype-target-blank.mjs', import.meta.url)),
  },

  // Modules Nuxt : UI, analytics, fonts, icônes, images et gestion de contenu
  modules: [
    '@nuxt/ui',
    '@nuxtjs/plausible',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxt/eslint',
  ],
  css: ['~/assets/css/main.css'],

  // Icônes NuxtUI remplacées par leurs équivalents Tabler
  appConfig: {
    ui: {
      icons: {
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
        star: 'tabler:star',
        stop: 'tabler:player-stop',
        success: 'tabler:square-rounded-check',
        system: 'tabler:device-desktop',
        tip: 'tabler:bulb',
        upload: 'tabler:upload',
        warning: 'tabler:alert-triangle',
      },
    },
  },

  // Variables d'environnement accessibles côté client
  runtimeConfig: {
    public: {
      cdnUrl: process.env.CDN_URL || '',
      cdnDevToken: process.env.NODE_ENV === 'development' ? process.env.CDN_DEV_TOKEN || '' : '',
      plausibleUrl: process.env.PLAUSIBLE_URL || '',
    },
  },

  // Mode sombre par défaut pour l'identité visuelle du club
  app: {
    pageTransition: {
      name: 'fade',
      mode: 'out-in',
    },
  },

  colorMode: {
    storage: 'sessionStorage',
  },

  // Polices hébergées localement pour de meilleures performances et confidentialité
  fonts: {
    defaults: {
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
    },
    families: [
      { name: 'Outfit', provider: 'local' },
      { name: 'Racing Sans One', provider: 'local', weights: [400] },
      {
        name: 'Open Dyslexic',
        provider: 'local',
        weights: [400, 700],
        styles: ['normal', 'italic'],
      },
    ],
    providers: {
      google: false,
    },
  },

  // Collections d'icônes personnalisées (Efrei Para, Efrei, Creative Commons, Logos partenaires)
  icon: {
    // Toutes les icônes doivent donc être embarquées dans le bundle client au build.
    fallbackToApi: false,
    clientBundle: {
      // Le scanner par défaut ne lit que les templates : ajouter les YAML de contenu,
      // les .ts (icônes déclarées en chaînes) et nuxt.config.ts (mapping appConfig.ui.icons —
      // le hook de Nuxt UI ignore les collections non-lucide, seul le scan les embarque)
      scan: {
        globInclude: ['app/**/*.{vue,ts}', 'content/**/*.{yml,md}', 'nuxt.config.ts'],
      },
      includeCustomCollections: true,
      sizeLimitKb: 512,
    },
    customCollections: [
      {
        prefix: 'efreipara',
        dir: './app/assets/icons/efreipara',
      },
      {
        prefix: 'efrei',
        dir: './app/assets/icons/efrei',
      },
      {
        prefix: 'creativecommons',
        dir: './app/assets/icons/creativecommons',
      },
      {
        prefix: 'ifly',
        dir: './app/assets/icons/ifly',
      },
    ],
  },

  // Configuration CDN pour les images (CDN Cloudflare)
  image: {
    domains: [process.env.CDN_URL?.replace('https://', '') || ''],
    alias: {
      cdn: process.env.CDN_URL || '',
    },
  },

  // Plausible Analytics : analytique respectueuse de la vie privée
  plausible: {
    enabled: true,
    apiHost: process.env.PLAUSIBLE_URL || '',
    domain: process.env.PLAUSIBLE_DOMAIN || '',
    //ignoredHostnames: ['localhost'],
    autoOutboundTracking: true,
  },

  // Configuration Nuxt Content avec plugin rehype pour ouvrir les liens externes dans un nouvel onglet
  content: {
    database: {
      type: 'libsql',
      url: 'file:.data/content/contents.db',
    },
    // Sans ce connecteur, Content réclame better-sqlite3 quand le postinstall tourne sous Node.
    experimental: {
      sqliteConnector: 'native',
    },
    build: {
      markdown: {
        rehypePlugins: {
          'rehype-target-blank': {
            instance: rehypeTargetBlank,
          },
        },
      },
    },
  },

  // Configuration Nitro : ne pas échouer si une page ne peut pas être pré-rendue
  nitro: {
    prerender: {
      failOnError: false,
      // Routes sans lien entrant : le crawler ne les trouve pas seul.
      routes: ['/devenir-membre', '/discord', '/instagram', '/rejoindre-bureau'],
    },
  },
})
