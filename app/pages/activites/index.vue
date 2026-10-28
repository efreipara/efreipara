<script setup lang="ts">
  const { getIcon } = await useActivities()
  const { buildCdnUrl } = useCdnAsset()
  const appConfig = useAppConfig()

  const { data: page } = await useAsyncData('activites-index', () =>
    queryCollection('activitesIndex').first(),
  )
  const { data: entries } = await useAsyncData('activites-sections', () =>
    queryCollection('activites').select('stem', 'label', 'alt', 'section').all(),
  )
  const sections = computed(() =>
    orderActivities(entries.value ?? []).map(({ key, to, label, alt, section }) => ({
      ...section,
      key,
      to,
      label,
      alt,
    })),
  )

  const featureUi = {
    root: 'gap-3',
    leading: 'bg-tint-10 mt-0.5 size-9 shrink-0 justify-center rounded-xl p-0',
    leadingIcon: 'text-activity size-4',
    title: 'text-highlighted text-sm text-wrap',
    description: 'mt-0 text-sm text-wrap',
  }
</script>

<template>
  <div>
    <SharedPageHero
      :headline="page?.hero.headline"
      :title="page?.hero.title"
      :description="page?.hero.description"
    />

    <!-- Image à gauche puis à droite en alternance (lg) ; toujours au-dessus du texte sur mobile -->
    <SharedSection
      v-for="(section, i) in sections"
      :key="section.key"
      :headline="section.label"
      :headline-icon="getIcon(section.key)"
      headline-tone="text-activity-strong"
      :title="section.title"
      :description="section.description"
      :links="[
        {
          label: section.linkLabel,
          to: section.to,
          variant: 'secondary',
          trailingIcon: appConfig.ui.icons.arrowRight,
          class: 'text-activity-strong',
        },
      ]"
      orientation="horizontal"
      :band="isBandSection(i, false)"
      :class="activityClass(section.key)"
      :ui="{ wrapper: ['order-last', i % 2 !== 0 && 'lg:order-first'] }"
    >
      <template #body>
        <ul class="grid gap-5 sm:grid-cols-2">
          <UPageFeature
            v-for="feature in section.features"
            :key="feature.title"
            as="li"
            v-bind="feature"
            :ui="featureUi"
          />
        </ul>
      </template>
      <img
        :src="buildCdnUrl(`${section.key}.jpg`)"
        :alt="section.alt"
        :loading="i === 0 ? 'eager' : 'lazy'"
        :fetchpriority="i === 0 ? 'high' : undefined"
        class="aspect-4/3 w-full rounded-2xl object-cover"
      />
    </SharedSection>

    <SharedCallToAction />
  </div>
</template>
