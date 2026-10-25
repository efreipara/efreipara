<script setup lang="ts">
  const { data: faqData } = await useAsyncData('faq', () => queryCollection('faq').first())

  const { getCategoryColor, getCategoryText } = useCategoryColor()

  const categoriesData = computed(() =>
    (faqData.value?.categories ?? []).map((category, catIndex) => ({
      name: category.name,
      color: category.color,
      icon: category.icon,
      questions: category.questions.map((question, i) => ({
        label: question.question,
        content: question.answer,
        value: `${catIndex}-${i}`,
        buttons: question.buttons,
      })),
    })),
  )

  // Question ouverte : trait vertical de la couleur de la catégorie, déroulé depuis le haut
  const accordionUi = (color?: string) => ({
    root: 'border-accented border-t',
    item: [
      'border-accented relative last:border-b',
      'before:absolute before:top-3 before:bottom-3 before:-left-3 before:w-[3px] before:origin-top before:scale-y-0 before:rounded-full lg:before:-left-5',
      'before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=open]:before:scale-y-100 motion-reduce:before:transition-none',
      getCategoryColor(color).bar,
    ],
    trigger:
      'text-highlighted cursor-pointer gap-4 py-4.5 text-base focus-visible:outline-inverted focus-visible:outline-2 focus-visible:outline-offset-2',
    body: 'text-muted pb-5 text-base leading-relaxed sm:ps-12',
  })
</script>

<template>
  <div>
    <SharedPageHero
      :headline="faqData?.headline"
      :title="faqData?.title"
      :description="faqData?.description"
    >
      <SharedCategoryChips :categories="categoriesData" />
    </SharedPageHero>

    <!-- L'en-tête précède sur bande : la première catégorie ne l'est pas -->
    <SharedCategorySection
      v-for="(category, catIndex) in categoriesData"
      :key="category.name"
      :name="category.name"
      :color="category.color"
      :count="faqData?.count ? countLabel(category.questions.length, faqData.count) : ''"
      :band="isBandSection(catIndex, false)"
    >
      <UAccordion
        :items="category.questions"
        type="single"
        collapsible
        :unmount-on-hide="false"
        :ui="accordionUi(category.color)"
      >
        <template #leading="{ index }">
          <span
            aria-hidden="true"
            class="font-title w-8 shrink-0 text-xl"
            :class="getCategoryText(category.color)"
          >
            {{ String(index + 1).padStart(2, '0') }}
          </span>
        </template>
        <!-- + qui devient − : la barre verticale pivote à plat -->
        <template #trailing>
          <span
            aria-hidden="true"
            class="text-muted group-data-[state=open]:text-highlighted relative ms-auto size-3.5 shrink-0"
          >
            <span
              class="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-current"
            />
            <span
              class="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rotate-90 rounded-full bg-current transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[state=open]:rotate-0 motion-reduce:transition-none"
            />
          </span>
        </template>
        <template #body="{ item }">
          <div class="space-y-4">
            <MDC :value="item.content" class="[&_p]:my-0 [&_p]:leading-[inherit] [&_p+p]:mt-3" />
            <div v-if="item.buttons?.length" class="flex flex-wrap gap-x-5 gap-y-2">
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
    </SharedCategorySection>

    <UContainer class="pb-12 sm:pb-16">
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
