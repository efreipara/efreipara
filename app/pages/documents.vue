<script setup lang="ts">
  const { data: documentsData } = await useAsyncData('documents', () => {
    return queryCollection('documents').first()
  })

  const appConfig = useAppConfig()

  const { getCategoryColor } = useCategoryColor()

  const categoryChips = computed(() =>
    (documentsData.value?.categories ?? []).map((c) => ({
      name: c.name,
      icon: c.icon || appConfig.ui.icons.folder,
      color: c.color,
    })),
  )
</script>

<template>
  <div>
    <SharedPageHero
      :headline="documentsData?.headline"
      :title="documentsData?.title"
      :description="documentsData?.description"
    />

    <UContainer class="pt-12 sm:pt-16">
      <SharedCategoryChips :categories="categoryChips" />
    </UContainer>

    <!-- Une ligne par document, séparée par des filets ; l'en-tête précède sur bande, d'où false -->
    <SharedCategorySection
      v-for="(category, catIndex) in documentsData?.categories"
      :key="category.name"
      :name="category.name"
      :color="category.color"
      :description="category.description"
      :count="
        documentsData?.count ? countLabel(category.documents.length, documentsData.count) : ''
      "
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
              <span class="text-highlighted block font-semibold">{{ doc.title }}</span>
              <span v-if="doc.description" class="text-muted mt-0.5 block text-sm">
                {{ doc.description }}
              </span>
            </span>
            <span
              class="text-muted hidden text-xs font-semibold tracking-[0.12em] whitespace-nowrap uppercase sm:block"
            >
              {{ documentsData?.typeLabels[doc.type] }}
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
        v-if="documentsData?.helpcta"
        :title="documentsData.helpcta.title"
        :description="documentsData.helpcta.description"
        :icon="documentsData.helpcta.icon"
        :buttons="documentsData.helpcta.buttons"
      />
    </UContainer>
  </div>
</template>
