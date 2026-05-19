<script setup lang="ts">
const { data: documentsData } = await useAsyncData('documents', () => {
  return queryCollection('documents').first()
})

// Récupération des liens sociaux
const { getSocialUrl, getSocialIcon } = useSocials()
const appConfig = useAppConfig()
</script>

<template>
  <div>
    <UPageHero
      title="Documents"
      description="Retrouvez ici tous les documents relatifs au club et aux activités de parachutisme."
    />
    <UContainer class="pb-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div class="flex-1 min-w-0">
                <h2 class="text-xl font-bold mb-1">{{ category.name }}</h2>
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
              class="block group"
            >
              <UCard class="cursor-pointer hover:bg-primary-800 transition-colors duration-200">
                <div class="flex items-start gap-3">
                  <UIcon
                    :name="doc.icon || appConfig.ui.icons.file"
                    class="size-5 text-gray-400 shrink-0 mt-0.5"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                      <h3 class="font-semibold text-sm">{{ doc.title }}</h3>
                      <UIcon
                        v-if="doc.type === 'external'"
                        :name="appConfig.ui.icons.external"
                        class="size-4 text-gray-400 shrink-0 transition-transform group-hover:translate-x-1"
                      />
                    </div>
                    <p class="text-xs text-gray-400 mt-1">
                      {{ doc.description }}
                    </p>
                  </div>
                </div>
              </UCard>
            </NuxtLink>
          </div>
        </UCard>
      </div>

      <UCard class="mt-12">
        <div class="text-center space-y-6">
          <div class="space-y-3">
            <div class="flex justify-center">
              <UIcon
                :name="appConfig.efreipara.icons.extras.question"
                class="size-12 text-primary-500"
              />
            </div>
            <h2 class="text-2xl font-bold">Un document manquant ?</h2>
            <p class="text-gray-400 max-w-xl mx-auto">
              Si vous ne trouvez pas le document que vous cherchez, n'hésitez pas à nous contacter !
            </p>
          </div>
          <div class="flex gap-3 justify-center flex-wrap">
            <UButton
              :to="getSocialUrl('Discord')"
              target="_blank"
              size="lg"
              :icon="getSocialIcon('Discord')"
              color="neutral"
            >
              Discord
            </UButton>
            <UButton
              :to="getSocialUrl('Instagram')"
              target="_blank"
              size="lg"
              :icon="getSocialIcon('Instagram')"
              color="neutral"
            >
              Instagram
            </UButton>
            <UButton
              to="https://github.com/efreipara/efreipara/issues/new"
              target="_blank"
              size="lg"
              :icon="getSocialIcon('GitHub')"
              color="neutral"
              variant="subtle"
            >
              Signaler sur GitHub
            </UButton>
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
