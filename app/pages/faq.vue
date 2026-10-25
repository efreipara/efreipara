<script setup lang="ts">
  const { data: faqData } = await useAsyncData('faq', () => queryCollection('faq').first())

  const { getCategoryColor } = useCategoryColor()
  const appConfig = useAppConfig()

  const categoriesData = computed(() => {
    if (!faqData.value?.categories) return []
    return faqData.value.categories.map((category, catIndex) => {
      return {
        name: category.name,
        color: category.color,
        icon: category.questions[0]?.icon ?? appConfig.ui.icons.info,
        questions: category.questions.map((question, i) => ({
          label: question.question,
          content: question.answer,
          icon: question.icon,
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
      :headline="faqData?.headline"
      :title="faqData?.title"
      :description="faqData?.description"
    />

    <UContainer class="py-12 sm:py-16">
      <SharedCategoryChips :categories="categoriesData" />

      <div class="flex flex-col gap-16 sm:gap-20">
        <template v-for="(category, catIndex) in categoriesData" :key="catIndex">
          <section
            :id="toAnchorId(category.name)"
            class="scroll-mt-[calc(var(--ui-header-height)+2rem)]"
          >
            <SharedCategoryHeader
              :name="category.name"
              :color="category.color"
              :count="faqData?.count ? countLabel(category.questions.length, faqData.count) : ''"
              class="mb-4"
            />

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
                    <MDC
                      :value="item.content"
                      class="[&_p]:my-0 [&_p]:leading-[inherit] [&_p+p]:mt-3"
                    />
                    <div v-if="item.buttons?.length" class="flex flex-wrap gap-2">
                      <UButton
                        v-for="(button, btnIndex) in item.buttons"
                        :key="btnIndex"
                        :to="button.to"
                        :target="button.target"
                        :icon="button.icon"
                        variant="secondary"
                        size="sm"
                      >
                        {{ button.label }}
                      </UButton>
                    </div>
                  </div>
                </template>
              </UAccordion>
            </UCard>
          </section>
        </template>
      </div>

      <SharedHelpCta
        v-if="faqData?.helpcta"
        :title="faqData.helpcta.title"
        :description="faqData.helpcta.description"
        :icon="faqData.helpcta.icon"
        :buttons="faqData.helpcta.buttons"
      />
    </UContainer>
  </div>
</template>
