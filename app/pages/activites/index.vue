<script setup lang="ts">

  const { getIcon } = await useActivities()
  const { buildCdnUrl } = useCdnAsset()
  const appConfig = useAppConfig()

  const { data: page } = await useAsyncData('activites-index', () =>
    queryCollection('activitesIndex').first(),
  )
  const { data: entries } = await useAsyncData('activites-sections', () =>
    queryCollection('activites').select('stem', 'section').all(),
  )
  const sections = computed(() =>
    orderActivities(entries.value ?? []).map(({ key, to, section }) => ({ ...section, key, to })),
  )

  const featureUi = {
    root: 'gap-3',
    leading: 'bg-tint-10 mt-0.5 size-9 shrink-0 rounded-xl p-0',
    leadingIcon: 'text-activity size-4',
    title: 'text-default text-sm text-wrap',
    description: 'mt-0 text-sm text-wrap',
  }
</script>

<template>
  <div>
    <SharedPageHero :title="page?.hero.title" :description="page?.hero.description" />

    <!-- Image à gauche puis à droite en alternance (lg) ; toujours au-dessus du texte sur mobile -->
    <UPageSection
      v-for="(section, i) in sections"
      :key="section.key"
      :title="section.title"
      :description="section.description"
      :features="section.features.map((feature) => ({ ...feature, ui: featureUi }))"
      :links="[
        {
          label: section.linkLabel,
          to: section.to,
          color: 'neutral',
          variant: 'subtle',
          trailingIcon: appConfig.ui.icons.arrowRight,
          class: 'hover:bg-tint-15 hover:text-activity rounded-full duration-200',
        },
      ]"
      orientation="horizontal"
      :class="[activityClass(section.key), i % 2 !== 0 && 'border-default border-y']"
      :ui="{
        container: 'gap-12 py-20 sm:gap-12 sm:py-20 lg:py-20',
        wrapper: ['order-last', i % 2 !== 0 && 'lg:order-first'],
        header: 'flex flex-wrap items-center gap-x-3 gap-y-4',
        leading: 'bg-tint-10 mb-0 size-14 justify-center rounded-2xl',
        title:
          'font-title text-default min-w-0 flex-1 text-3xl tracking-normal text-wrap sm:text-3xl lg:text-3xl',
        description: 'mt-0 basis-full text-base sm:text-base',
        features: 'gap-5 sm:grid-cols-2',
      }"
    >
      <template #leading>
        <UIcon :name="getIcon(section.key)" class="text-activity size-7" />
      </template>
      <img
        :src="buildCdnUrl(`${section.key}.jpg`)"
        :alt="section.alt"
        class="aspect-4/3 w-full rounded-2xl object-cover"
      />
    </UPageSection>

    <SharedCallToAction />
  </div>
</template>
