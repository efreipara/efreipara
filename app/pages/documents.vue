<script setup lang="ts">
  const { data: documentsData } = await useAsyncData('documents', () => {
    return queryCollection('documents').first()
  })

  const appConfig = useAppConfig()

  const { getCategoryColor } = useCategoryColor()

  const categoryId = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

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
    <SharedPageHero :title="documentsData?.title" :description="documentsData?.description" />

    <UContainer class="pb-16">
      <SharedCategoryChips :categories="categoryChips" />

      <!-- Sections par catégorie -->
      <div class="flex flex-col gap-10">
        <template v-for="(category, catIndex) in documentsData?.categories" :key="catIndex">
          <section :id="categoryId(category.name)">
            <!-- En-tête de catégorie -->
            <div class="mb-6 flex items-center gap-4">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-2xl"
                :class="getCategoryColor(category.color).bg"
              >
                <UIcon
                  :name="category.icon || appConfig.ui.icons.folder"
                  class="size-6"
                  :class="getCategoryColor(category.color).text"
                />
              </div>
              <div class="min-w-0 flex-1">
                <h2 class="font-title text-xl font-bold">{{ category.name }}</h2>
                <p class="text-muted text-sm">{{ category.description }}</p>
              </div>
              <UBadge color="neutral" variant="subtle" size="sm" class="shrink-0">
                {{ category.documents.length }}
                doc{{ category.documents.length > 1 ? 's' : '' }}
              </UBadge>
            </div>

            <!-- Grille de documents -->
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <NuxtLink
                v-for="(doc, docIndex) in category.documents"
                :key="docIndex"
                :to="doc.url"
                :target="doc.type === 'external' ? '_blank' : undefined"
                :rel="doc.type === 'external' ? 'noopener noreferrer' : undefined"
                class="group"
              >
                <UCard
                  variant="subtle"
                  class="group-hover:bg-primary/5 h-full cursor-pointer transition-colors duration-150"
                >
                  <div class="flex gap-3">
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-xl"
                      :class="getCategoryColor(category.color).bg"
                    >
                      <UIcon
                        :name="doc.icon || appConfig.ui.icons.file"
                        class="size-5"
                        :class="getCategoryColor(category.color).text"
                      />
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="flex items-start justify-between gap-2">
                        <p class="leading-tight font-semibold">{{ doc.title }}</p>
                        <UIcon
                          :name="
                            doc.type === 'external'
                              ? appConfig.ui.icons.external
                              : appConfig.ui.icons.arrowRight
                          "
                          class="text-muted mt-0.5 size-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
                        />
                      </div>
                      <p v-if="doc.description" class="text-muted mt-1 text-sm">
                        {{ doc.description }}
                      </p>
                    </div>
                  </div>
                </UCard>
              </NuxtLink>
            </div>
          </section>

          <USeparator v-if="catIndex < (documentsData?.categories.length ?? 0) - 1" />
        </template>
      </div>

      <SharedHelpCta
        v-if="documentsData?.helpcta"
        :title="documentsData.helpcta.title"
        :description="documentsData.helpcta.description"
        :buttons="documentsData.helpcta.buttons"
      />
    </UContainer>
  </div>
</template>
