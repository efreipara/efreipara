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
      // Le scanner par défaut ne lit que les templates : ajouter les YAML de contenu
      // et les .ts (app.config.ts) où les icônes sont déclarées en chaînes
      scan: {
        globInclude: ['app/**/*.{vue,ts}', 'content/**/*.{yml,md}'],
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
    },
  },
})
