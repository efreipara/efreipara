<script setup lang="ts">
  const { t } = await useT('documents')

  const appConfig = useAppConfig()

  // Site de destination à droite de chaque document : le domaine du lien, ou le nom du club
  const { data: seo } = useContentData('seo')
  const siteName = computed(() => seo.value?.defaults.siteName)

  const { getCategoryColor } = useCategoryColor()

  const categoryChips = computed(() =>
    (t.categories ?? []).map((c) => ({
      name: c.name,
      icon: c.icon || appConfig.ui.icons.folder,
      color: c.color,
    })),
  )
</script>

<template>
  <div>
    <SharedPageHero :headline="t.headline" :title="t.title" :description="t.description">
      <SharedCategoryChips :categories="categoryChips" />
    </SharedPageHero>

    <!-- Une ligne par document, séparée par des filets ; l'en-tête précède sur bande, d'où false -->
    <SharedCategorySection
      v-for="(category, catIndex) in t.categories"
      :key="category.name"
      :name="category.name"
      :color="category.color"
      :description="category.description"
      :count="t.count ? countLabel(category.documents.length, t.count) : ''"
      :band="isBandSection(catIndex, false)"
    >
      <ul class="border-accented border-t">
        <li v-for="doc in category.documents" :key="doc.url" class="border-accented border-b">
          <ULink
            :to="doc.url"
            :target="doc.type === 'external' ? '_blank' : undefined"
            raw
            class="group focus-visible:outline-inverted -mx-3 grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg px-3 py-4 transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.99] sm:grid-cols-[auto_1fr_auto_auto]"
            :class="getCategoryColor(category.color).rowHover"
          >
            <UIcon
              :name="doc.icon || appConfig.ui.icons.file"
              class="size-5"
              :class="getCategoryColor(category.color).text"
            />
            <span class="min-w-0">
              <span class="text-highlighted block font-semibold" data-goal-title>
                {{ doc.title }}
              </span>
              <span v-if="doc.description" class="text-muted mt-0.5 block text-sm">
                {{ doc.description }}
              </span>
            </span>
            <span
              class="text-muted hidden text-[0.6875rem] font-semibold tracking-[0.12em] whitespace-nowrap uppercase sm:block"
            >
              {{ documentHost(doc.url) ?? siteName }}
            </span>
            <UIcon
              :name="
                doc.type === 'external'
                  ? appConfig.ui.icons.external
                  : appConfig.ui.icons.arrowRight
              "
              class="text-muted group-hover:text-highlighted size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </ULink>
        </li>
      </ul>
    </SharedCategorySection>

    <UContainer class="pb-12 sm:pb-16">
      <SharedHelpCta
        v-if="t.helpcta"
        :title="t.helpcta.title"
        :description="t.helpcta.description"
        :buttons="t.helpcta.buttons"
      />
    </UContainer>
  </div>
</template>
