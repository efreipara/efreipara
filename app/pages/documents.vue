<script setup lang="ts">
  const { data: documentsData } = await useAsyncData('documents', () => {
    return queryCollection('documents').first()
  })

  const appConfig = useAppConfig()

  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
    red: { bg: 'bg-red-500/10', text: 'text-red-500' },
    green: { bg: 'bg-green-500/10', text: 'text-green-500' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
    navy: { bg: 'bg-primary/10', text: 'text-primary' },
  }

  const getCategoryColor = (color?: string) =>
    colorMap[color ?? ''] ?? { bg: 'bg-primary/10', text: 'text-primary' }
</script>

<template>
  <div>
    <PageHero
      title="Documents"
      description="Retrouvez ici tous les documents relatifs au club et aux activités de parachutisme."
    />
    <UContainer class="pb-16">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <UCard
          v-for="(category, catIndex) in documentsData?.categories"
          :key="catIndex"
          variant="subtle"
        >
          <template #header>
            <div class="flex items-center gap-4">
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-xl"
                :class="getCategoryColor(category.color).bg"
              >
                <UIcon
                  :name="category.icon || appConfig.ui.icons.folder"
                  :class="getCategoryColor(category.color).text"
                  class="size-5"
                />
              </div>
              <div class="min-w-0 flex-1">
                <h2 class="text-lg font-bold">{{ category.name }}</h2>
                <p class="text-muted text-sm">{{ category.description }}</p>
              </div>
            </div>
          </template>

          <div class="space-y-1">
            <template v-for="(doc, docIndex) in category.documents" :key="docIndex">
              <div v-if="docIndex > 0" class="border-default border-t" />
              <NuxtLink
                :to="doc.url"
                :target="doc.type === 'external' ? '_blank' : undefined"
                :rel="doc.type === 'external' ? 'noopener noreferrer' : undefined"
                class="group hover:bg-primary/10 flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150"
              >
                <UIcon
                  :name="doc.icon || appConfig.ui.icons.file"
                  class="size-4 shrink-0"
                  :class="getCategoryColor(category.color).text"
                />
                <div class="min-w-0 flex-1">
                  <p class="font-medium leading-tight">{{ doc.title }}</p>
                  <p v-if="doc.description" class="text-muted mt-0.5 text-sm">
                    {{ doc.description }}
                  </p>
                </div>
                <UIcon
                  :name="
                    doc.type === 'external'
                      ? appConfig.ui.icons.external
                      : appConfig.ui.icons.arrowRight
                  "
                  class="text-muted size-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </NuxtLink>
            </template>
          </div>
        </UCard>
      </div>

      <HelpCta
        title="Un document manquant ?"
        description="Si vous ne trouvez pas le document que vous cherchez, n'hésitez pas à nous contacter !"
        :buttons="['discord', 'instagram', 'github']"
      />
    </UContainer>
  </div>
</template>
