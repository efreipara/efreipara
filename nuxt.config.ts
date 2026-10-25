// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import rehypeTargetBlank from './rehype-target-blank.mjs'
import pkg from './package.json'
import { redirectRoutes } from './content.routes'

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
    // Pré-bundlées en dev : sinon Vite les découvre au premier import et recharge la page
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

  modules: [
    '@nuxt/ui',
    '@nuxtjs/plausible',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/content',
    '@nuxt/eslint',
  ],
  css: ['~/assets/css/main.css'],

  // Version affichée dans le pied de page ; icônes NuxtUI remplacées par leurs équivalents Tabler
  appConfig: {
    version: pkg.version,
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

  // Tout runtimeConfig.public est écrit dans le HTML : rien de secret (SECURITY.md)
  runtimeConfig: {
    public: {
      cdnUrl: process.env.CDN_URL || '',
      cdnDevToken: process.env.NODE_ENV === 'development' ? process.env.CDN_DEV_TOKEN || '' : '',
      plausibleUrl: process.env.PLAUSIBLE_URL || '',
    },
  },

  app: {
    head: {
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '16x16 24x24 32x32 48x48' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
    pageTransition: {
      name: 'fade',
      mode: 'out-in',
    },
  },

  colorMode: {
    storage: 'sessionStorage',
  },

  fonts: {
    defaults: {
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
    },
    families: [
      { name: 'Outfit', provider: 'local', weights: ['100 900'] },
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

  icon: {
    // Aucune icône chargée à l'exécution : toutes sont embarquées au build
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
      {
        prefix: 'activite',
        dir: './app/assets/icons/activite',
      },
    ],
  },

  plausible: {
    enabled: true,
    apiHost: process.env.PLAUSIBLE_URL || '',
    domain: process.env.PLAUSIBLE_DOMAIN || '',
    autoOutboundTracking: true,
  },

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

  // Ancienne page À propos, retirée : l'adresse publique mène à l'accueil
  routeRules: {
    '/about': { redirect: '/' },
  },

  // Une page en erreur est absente de la sortie sans faire échouer le build : relire le journal
  nitro: {
    prerender: {
      failOnError: false,
      // Redirections, sans lien entrant : le crawler ne les trouve pas seul.
      routes: [...redirectRoutes(), '/about'],
    },
  },
})
