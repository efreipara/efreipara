<script setup lang="ts">
  import { marked } from 'marked'
  import DOMPurify from 'isomorphic-dompurify'

  const { data: faqData } = await useAsyncData('faq', () => queryCollection('faq').first())
  const appConfig = useAppConfig()

  const parseMarkdown = (text: string) => {
    const html = marked(text, { breaks: true }) as string
    return DOMPurify.sanitize(html)
  }

  const { getCategoryColor } = useCategoryColor()

  const categoriesData = computed(() => {
    if (!faqData.value?.categories) return []
    return faqData.value.categories.map((category, catIndex) => {
      return {
        name: category.name,
        color: category.color,
        icon: category.questions[0]?.icon || appConfig.efreipara.icons.extras.question,
        questions: category.questions.map((question, i) => ({
          label: question.question,
          content: question.answer,
          icon: question.icon || appConfig.efreipara.icons.extras.question,
          value: `${catIndex}-${i}`,
          buttons: question.buttons,
        })),
      }
    })
  })
</script>

<template>
  <div>
    <SharedPageHero
      :title="faqData?.title || 'Questions Fréquentes'"
      :description="faqData?.description"
    />

    <UContainer class="pb-16">
      <SharedCategoryChips :categories="categoriesData" />

      <!-- Sections par catégorie -->
      <div class="flex flex-col gap-10">
        <template v-for="(category, catIndex) in categoriesData" :key="catIndex">
          <section :id="toAnchorId(category.name)">
            <!-- En-tête de catégorie -->
            <div class="mb-4 flex items-center gap-4">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-2xl"
                :class="getCategoryColor(category.color).bg"
              >
                <UIcon
                  :name="category.icon"
                  class="size-6"
                  :class="getCategoryColor(category.color).text"
                />
              </div>
              <div class="min-w-0 flex-1">
                <h2 class="font-title text-xl font-bold">{{ category.name }}</h2>
              </div>
              <UBadge color="neutral" variant="subtle" size="sm" class="shrink-0">
                {{ category.questions.length }}
                question{{ category.questions.length > 1 ? 's' : '' }}
              </UBadge>
            </div>

            <!-- Accordéon des questions -->
            <UCard variant="subtle">
              <UAccordion
                :items="category.questions"
                type="single"
                collapsible
                :unmount-on-hide="false"
                :ui="{
                  trigger: 'text-base font-medium py-4 cursor-pointer gap-4',
                  leadingIcon: getCategoryColor(category.color).text,
                  body: 'text-muted pb-4',
                  item: 'dark:border-accented',
                }"
              >
                <template #body="{ item }">
                  <div class="space-y-4">
                    <div
                      class="prose prose-sm dark:prose-invert max-w-none"
                      v-html="parseMarkdown(item.content)"
                    />
                    <div v-if="item.buttons?.length" class="flex flex-wrap gap-2">
                      <UButton
                        v-for="(button, btnIndex) in item.buttons"
                        :key="btnIndex"
                        :to="button.to"
                        :target="button.target"
                        :icon="button.icon"
                        :variant="
                          (button.variant as
                            'solid' | 'subtle' | 'outline' | 'ghost' | 'soft' | 'link') || 'solid'
                        "
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
          </section>

          <USeparator v-if="catIndex < categoriesData.length - 1" />
        </template>
      </div>

      <SharedHelpCta
        v-if="faqData?.helpcta"
        :title="faqData.helpcta.title"
        :description="faqData.helpcta.description"
        :buttons="faqData.helpcta.buttons"
      />
    </UContainer>
  </div>
</template>
