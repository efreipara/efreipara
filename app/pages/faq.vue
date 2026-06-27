<script setup lang="ts">
  import { marked } from 'marked'
  import DOMPurify from 'isomorphic-dompurify'

  // Récupération des données FAQ depuis Nuxt Content
  const { data: faqData } = await useAsyncData('faq', () => {
    return queryCollection('faq').first()
  })

  const appConfig = useAppConfig()

  // Helper pour convertir le Markdown en HTML sécurisé
  const parseMarkdown = (text: string) => {
    const html = marked(text, { breaks: true }) as string
    return DOMPurify.sanitize(html)
  }

  // Transformation des catégories pour UAccordion
  const categoriesData = computed(() => {
    if (!faqData.value?.categories) return []

    return faqData.value.categories.map((category) => ({
      name: category.name,
      questions: category.questions.map((question, index) => ({
        label: question.question,
        content: question.answer,
        icon: question.icon || appConfig.efreipara.icons.extras.question,
        value: String(index),
        buttons: question.buttons,
      })),
    }))
  })
</script>

<template>
  <UContainer class="py-16">
    <!-- En-tête -->
    <div class="mb-12 text-center">
      <h1 class="font-title mb-4 text-4xl font-bold md:text-5xl">
        {{ faqData?.title || 'Questions Fréquentes' }}
      </h1>
      <p class="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
        {{ faqData?.description || 'Retrouvez ici les réponses aux questions les plus fréquentes' }}
      </p>
    </div>

    <!-- Accordéon FAQ par catégorie -->
    <div class="space-y-6">
      <UCard
        v-for="({ name, questions }, catIndex) in categoriesData"
        :key="catIndex"
        variant="subtle"
      >
        <template #header>
          <h2 class="font-title text-2xl font-bold">{{ name }}</h2>
        </template>

        <!-- Questions de la catégorie -->
        <UAccordion
          v-if="questions.length > 0"
          :items="questions"
          type="single"
          :unmount-on-hide="false"
          :ui="{
            trigger: 'text-base font-medium py-4',
            body: 'text-base text-gray-600 dark:text-gray-400 pb-4',
            item: 'border-b border-gray-200 dark:border-gray-800 last:border-b-0',
          }"
        >
          <template #body="{ item }">
            <div class="space-y-4">
              <div class="max-w-none" v-html="parseMarkdown(item.content)" />
              <div v-if="item.buttons?.length" class="flex flex-wrap gap-2">
                <UButton
                  v-for="(button, btnIndex) in item.buttons"
                  :key="btnIndex"
                  :to="button.to"
                  :target="button.target"
                  :icon="button.icon"
                  :variant="button.variant || 'solid'"
                  color="neutral"
                  size="sm"
                  class="rounded-full"
                >
                  {{ button.label }}
                </UButton>
              </div>
            </div>
          </template>
        </UAccordion>
      </UCard>
    </div>

    <!-- Call to action -->
    <HelpCta
      title="Une question sans réponse ?"
      description="N'hésite pas à nous poser tes questions sur Discord ou Instagram !"
      :buttons="['discord', 'instagram']"
    />
  </UContainer>
</template>
