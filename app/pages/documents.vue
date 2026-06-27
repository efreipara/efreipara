<script setup lang="ts">
  const { data: documentsData } = await useAsyncData('documents', () => {
    return queryCollection('documents').first()
  })

  const appConfig = useAppConfig()
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
            <div class="flex items-start gap-3">
              <div class="shrink-0 p-2">
                <UIcon :name="category.icon || appConfig.ui.icons.file" class="size-6" />
              </div>
              <div class="min-w-0 flex-1">
                <h2 class="mb-1 text-xl font-bold">{{ category.name }}</h2>
                <p class="text-sm text-gray-400">
                  {{ category.description }}
                </p>
              </div>
            </div>
          </template>
          <div class="space-y-3">
            <NuxtLink
              v-for="(doc, docIndex) in category.documents"
              :key="docIndex"
              :to="doc.url"
              :target="doc.type === 'external' ? '_blank' : undefined"
              :rel="doc.type === 'external' ? 'noopener noreferrer' : undefined"
              class="group block"
            >
              <UCard class="hover:bg-primary-800 cursor-pointer transition-colors duration-200">
                <div class="flex items-start gap-3">
                  <UIcon
                    :name="doc.icon || appConfig.ui.icons.file"
                    class="mt-0.5 size-5 shrink-0 text-gray-400"
                  />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-2">
                      <h3 class="text-sm font-semibold">{{ doc.title }}</h3>
                      <UIcon
                        v-if="doc.type === 'external'"
                        :name="appConfig.ui.icons.external"
                        class="size-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1"
                      />
                    </div>
                    <p class="mt-1 text-xs text-gray-400">
                      {{ doc.description }}
                    </p>
                  </div>
                </div>
              </UCard>
            </NuxtLink>
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
