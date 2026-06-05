import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    home: defineCollection({
      type: 'data',
      source: 'home.yml',
      schema: z.object({
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
          items: z.array(
            z.object({
              title: z.string(),
              description: z.string(),
              type: z.string(),
              to: z.string(),
            }),
          ),
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
            type: z.string(),
          }),
        ),
      }),
    }),
    activitesIndex: defineCollection({
      type: 'data',
      source: 'activites.yml',
      schema: z.object({
        hero: z.object({
          title: z.string(),
          description: z.string(),
        }),
        sections: z.array(
          z.object({
            type: z.string(),
            title: z.string(),
            description: z.string(),
            alt: z.string(),
            features: z.array(
              z.object({
                title: z.string(),
                description: z.string(),
                icon: z.string(),
              }),
            ),
            link: z.object({
              label: z.string(),
            }),
          }),
        ),
      }),
    }),
    activites: defineCollection({
      type: 'data',
      source: 'activites/*.yml',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        label: z.string(),
        alt: z.string(),
      }),
    }),
    legal: defineCollection({
      type: 'page',
      source: '{mentions-legales,reglement,rgpd}.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        updatedAt: z.string().optional(),
      }),
    }),
    faq: defineCollection({
      type: 'data',
      source: 'faq.yml',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        categories: z.array(
          z.object({
            name: z.string(),
            questions: z.array(
              z.object({
                question: z.string(),
                answer: z.string(),
                icon: z.string().optional(),
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
    }),
    documents: defineCollection({
      type: 'data',
      source: 'documents.yml',
      schema: z.object({
        title: z.string(),
        description: z.string(),
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
    }),
    seo: defineCollection({
      type: 'data',
      source: 'seo.yml',
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
    }),
  },
})
