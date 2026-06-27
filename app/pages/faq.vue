<script setup lang="ts">
  import { marked } from 'marked'
  import DOMPurify from 'isomorphic-dompurify'

  const { data: faqData } = await useAsyncData('faq', () => queryCollection('faq').first())
  const appConfig = useAppConfig()

  const parseMarkdown = (text: string) => {
    const html = marked(text, { breaks: true }) as string
    return DOMPurify.sanitize(html)
  }

  const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
    green: { bg: 'bg-green-500/10', text: 'text-green-500' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
    red: { bg: 'bg-red-500/10', text: 'text-red-500' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-500' },
    gray: { bg: 'bg-gray-500/10', text: 'text-gray-500' },
  }

  const getCategoryColor = (color?: string) =>
    colorMap[color ?? ''] ?? { bg: 'bg-primary/10', text: 'text-primary' }

  const categoriesData = computed(() => {
    if (!faqData.value?.categories) return []
    return faqData.value.categories.map((category, catIndex) => {
      return {
        name: category.name,
        color: (category as unknown as { color?: string }).color,
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

  const categoryId = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const headerHeight = document.querySelector('header')?.offsetHeight ?? 0
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 32
    window.scrollTo({ top, behavior: 'smooth' })
  }
</script>

<template>
  <div>
    <PageHero
      :title="faqData?.title || 'Questions Fréquentes'"
      :description="faqData?.description"
    />

    <UContainer class="pb-16">
      <!-- Navigation rapide -->
      <div class="mb-16 flex flex-wrap gap-2">
        <button
          v-for="(category, i) in categoriesData"
          :key="i"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-opacity hover:opacity-80"
          :class="[getCategoryColor(category.color).bg, getCategoryColor(category.color).text]"
          @click="scrollTo(categoryId(category.name))"
        >
          <UIcon :name="category.icon" class="size-4" />
          {{ category.name }}
        </button>
      </div>

      <!-- Sections par catégorie -->
      <div class="flex flex-col gap-10">
        <template v-for="(category, catIndex) in categoriesData" :key="catIndex">
          <section :id="categoryId(category.name)">
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
                  item: 'border-b border-neutral-200 dark:border-neutral-800 last:border-b-0',
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

      <HelpCta
        title="Une question sans réponse ?"
        description="N'hésite pas à nous poser tes questions sur Discord ou Instagram !"
        :buttons="['discord', 'instagram']"
      />
    </UContainer>
  </div>
</template>
