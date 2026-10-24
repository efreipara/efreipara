import { z } from '@nuxt/content'
import { ACTIVITY_KEYS } from './app/utils/activities'

const activity = z.enum(ACTIVITY_KEYS)

// Bouton dont seul le libellé et l'icône viennent du contenu
const link = z.object({ label: z.string(), icon: z.string() })

// Encadré d'aide en bas de Documents et FAQ
const helpCta = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  buttons: z.array(z.enum(['discord', 'instagram', 'github'])),
})

// Sources et schémas des collections : enveloppés par defineCollection dans content.config.ts,
// importés tels quels par les tests de contenu (defineCollection ne fonctionne que dans Nuxt).
export const collections = {
  home: {
    type: 'data' as const,
    source: 'pages/home.yml',
    schema: z.object({
      hero: z.object({
        links: z.array(z.object({ label: z.string(), to: z.string(), icon: z.string() })),
        scrollIcon: z.string(),
      }),
      sections: z.object({
        about: z.string(),
        activites: z.string(),
        why: z.string(),
        partners: z.string(),
      }),
      about: z.object({
        paragraphs: z.array(z.string()),
      }),
      stats: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string(),
        }),
      ),
      activites: z.object({
        link: z.object({
          label: z.string(),
          to: z.string(),
        }),
      }),
      why: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string(),
          type: activity,
        }),
      ),
    }),
  },
  galerie: {
    type: 'data' as const,
    source: 'pages/galerie.yml',
    schema: z.object({
      hero: z.object({
        title: z.string(),
        description: z.string(),
        linkLabel: z.string(),
      }),
      albumIcons: z.object({ date: z.string(), location: z.string() }),
      items: z.array(
        z.object({
          title: z.string(),
          type: activity,
          date: z.string().date(),
          location: z.string(),
          url: z.string(),
          photo: z.string().optional(),
          source: z.string().optional(),
        }),
      ),
    }),
  },
  activitesIndex: {
    type: 'data' as const,
    source: 'pages/activites.yml',
    schema: z.object({
      hero: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),
  },
  activites: {
    type: 'data' as const,
    source: 'pages/activites/*.yml',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      label: z.string(),
      alt: z.string(),
      icon: z.string(),
      galleryLabel: z.string().optional(),
      menu: z.object({ label: z.string(), description: z.string() }),
      card: z.object({ title: z.string(), description: z.string() }),
      section: z.object({
        title: z.string(),
        description: z.string(),
        linkLabel: z.string(),
        features: z.array(
          z.object({ title: z.string(), description: z.string(), icon: z.string() }),
        ),
      }),
      imageCount: z.number().int().min(0).optional(),
      intro: z.array(z.string()).optional(),
      features: z
        .array(z.object({ title: z.string(), description: z.string(), icon: z.string() }))
        .optional(),
      stats: z
        .array(z.object({ value: z.string(), label: z.string(), icon: z.string() }))
        .optional(),
      steps: z
        .array(z.object({ title: z.string(), description: z.string(), icon: z.string() }))
        .optional(),
      requirements: z
        .array(
          z.object({ icon: z.string(), label: z.string(), description: z.string().optional() }),
        )
        .optional(),
    }),
  },
  legal: {
    type: 'page' as const,
    source: 'pages/legal/*.md',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      updatedAt: z.string().date().optional(),
    }),
  },
  faq: {
    type: 'data' as const,
    source: 'pages/faq.yml',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      helpcta: helpCta.optional(),
      categories: z.array(
        z.object({
          name: z.string(),
          color: z.string().optional(),
          questions: z.array(
            z.object({
              question: z.string(),
              answer: z.string(),
              icon: z.string(),
              buttons: z
                .array(
                  z.object({
                    label: z.string(),
                    to: z.string(),
                    icon: z.string().optional(),
                    variant: z.string().optional(),
                    target: z.string().optional(),
                  }),
                )
                .optional(),
            }),
          ),
        }),
      ),
    }),
  },
  documents: {
    type: 'data' as const,
    source: 'pages/documents.yml',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      helpcta: helpCta.optional(),
      categories: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
          icon: z.string().optional(),
          color: z.string().optional(),
          documents: z.array(
            z.object({
              title: z.string(),
              description: z.string(),
              url: z.string(),
              icon: z.string().optional(),
              type: z.enum(['internal', 'external']),
            }),
          ),
        }),
      ),
    }),
  },
  contact: {
    type: 'data' as const,
    source: 'pages/contact.yml',
    schema: z.object({
      hero: z.object({
        title: z.string(),
        description: z.string(),
      }),
      email: z.object({
        title: z.string(),
        description: z.string(),
        buttonLabel: z.string(),
        icon: z.string(),
      }),
      socials: z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
      }),
      address: z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
        buttons: z.object({
          google: link,
          apple: link,
          waze: link,
        }),
      }),
      support: z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
        buttons: z.object({
          github: z.string(),
          email: z.string(),
        }),
      }),
    }),
  },
  cta: {
    type: 'data' as const,
    source: 'global/cta.yml',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      image: z.string(),
      alt: z.string(),
      links: z.array(
        z.object({
          label: z.string(),
          to: z.string(),
          icon: z.string(),
          variant: z.string().optional(),
        }),
      ),
    }),
  },
  club: {
    type: 'data' as const,
    source: 'global/club.yml',
    schema: z.object({
      email: z.string().email(),
      address: z.string(),
      maintainerEmail: z.string().email(),
      socials: z.array(
        z.object({ key: z.string(), name: z.string(), icon: z.string(), url: z.string().url() }),
      ),
      github: z.object({ repo: z.string().url(), issues: z.string().url() }),
    }),
  },
  labels: {
    type: 'data' as const,
    source: 'global/labels.yml',
    schema: z.object({
      banner: z.object({
        register: z.string(),
        registerIcon: z.string(),
        info: z.string(),
        close: z.string(),
      }),
    }),
  },
  nextEvent: {
    type: 'data' as const,
    source: 'global/next-event.yml',
    schema: z.object({
      title: z.string(),
      date: z.string().date(),
      type: activity,
      url: z.string(),
    }),
  },
  partners: {
    type: 'data' as const,
    source: 'global/partners.yml',
    schema: z.object({
      items: z.array(
        z.object({
          name: z.string(),
          icon: z.string().optional(),
          logo: z.string().optional(),
          url: z.string(),
          activites: z.array(activity).optional(),
        }),
      ),
    }),
  },
  rejoindre: {
    type: 'data' as const,
    source: 'pages/rejoindre.yml',
    schema: z.object({
      hero: z.object({
        title: z.string(),
        description: z.string(),
      }),
      alert: z.object({
        title: z.string(),
        description: z.string(),
        actionLabel: z.string(),
      }),
      why: z.object({
        title: z.string(),
        features: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
            icon: z.string(),
            type: activity,
          }),
        ),
      }),
      options: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string(),
          link: z.string(),
          linkText: z.string(),
          type: activity,
          slug: z.string(),
          ogImage: z.string(),
        }),
      ),
    }),
  },
  qr: {
    type: 'data' as const,
    source: 'pages/qr.yml',
    schema: z.object({
      alt: z.string(),
      homeIcon: z.string(),
      fullscreen: z.object({ enterIcon: z.string(), exitIcon: z.string() }),
    }),
  },
  redirects: {
    type: 'data' as const,
    source: 'pages/redirects.yml',
    schema: z.object({
      rejoindre: z.object({
        redirectText: z.string(),
        buttonLabel: z.string(),
      }),
      discord: z.object({
        title: z.string(),
        redirectText: z.string(),
        buttonLabel: z.string(),
      }),
      instagram: z.object({
        title: z.string(),
        redirectText: z.string(),
        buttonLabel: z.string(),
      }),
    }),
  },
  navigation: {
    type: 'data' as const,
    source: 'global/navigation.yml',
    schema: z.object({
      accessibilityMenu: z.object({ label: z.string(), icon: z.string(), activeIcon: z.string() }),
      accessibility: z.array(
        z.object({
          key: z.string(),
          label: z.string(),
          icon: z.string(),
        }),
      ),
      activitiesIndex: z.object({
        label: z.string(),
        to: z.string(),
        icon: z.string(),
      }),
      pages: z.array(
        z.object({
          label: z.string(),
          to: z.string(),
          icon: z.string().optional(),
          header: z.number().optional(),
        }),
      ),
      footer: z.object({
        activities: z.string(),
        club: z.string(),
        social: z.string(),
        legal: z.string(),
      }),
      legal: z.array(
        z.object({
          label: z.string(),
          to: z.string(),
          target: z.string().optional(),
        }),
      ),
    }),
  },
  seo: {
    type: 'data' as const,
    source: 'global/seo.yml',
    schema: z.object({
      defaults: z.object({
        siteName: z.string(),
        separator: z.string(),
        baseUrl: z.string(),
        ogImage: z.string(),
        ogType: z.string(),
        ogSiteName: z.string(),
        twitterCard: z.string(),
        locale: z.string(),
        themeColor: z.string(),
        author: z.string(),
        robots: z.string().optional(),
      }),
      pages: z.record(
        z.object({
          title: z.string(),
          description: z.string(),
          ogImage: z.string().optional(),
          robots: z.string().optional(),
        }),
      ),
    }),
  },
}
