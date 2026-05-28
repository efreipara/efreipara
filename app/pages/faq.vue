<script setup lang="ts">
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

// Récupération des données FAQ depuis Nuxt Content
const { data: faqData } = await useAsyncData('faq', () => {
  return queryCollection('faq').first()
})

// Récupération des liens sociaux
const { getSocialUrl, getSocialIcon } = useSocials()
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
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-title font-bold mb-4">
        {{ faqData?.title || 'Questions Fréquentes' }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
          <h2 class="text-2xl font-title font-bold">{{ name }}</h2>
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
    <UCard class="mt-12">
      <div class="text-center space-y-6">
        <div class="space-y-3">
          <div class="flex justify-center">
            <UIcon
              :name="appConfig.efreipara.icons.extras.question"
              class="size-12 text-primary-500"
            />
          </div>
          <h2 class="text-2xl font-bold">Une question sans réponse ?</h2>
          <p class="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            N'hésite pas à nous poser tes questions sur Discord ou Instagram !
          </p>
        </div>
        <div class="flex gap-3 justify-center flex-wrap">
          <UButton
            :to="getSocialUrl('Discord')"
            target="_blank"
            size="lg"
            :icon="getSocialIcon('Discord')"
            color="neutral"
            class="rounded-full"
          >
            Discord
          </UButton>
          <UButton
            :to="getSocialUrl('Instagram')"
            target="_blank"
            size="lg"
            :icon="getSocialIcon('Instagram')"
            color="neutral"
            class="rounded-full"
          >
            Instagram
          </UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
