<script setup lang="ts">
  const { socials, club } = await useClub()
  const { version } = useAppConfig()
  const { labels } = await useLabels()
  const { activitiesIndex, activities, footerPages, footerLegal, footerTitles } =
    await useNavigation()

  const columns = computed(() => [
    {
      label: footerTitles.value.activities,
      children: [
        { label: activitiesIndex.value!.label, to: activitiesIndex.value!.to },
        ...activities.value.map((a) => ({ label: a.label, to: a.to })),
      ],
    },
    {
      label: footerTitles.value.club,
      children: footerPages.value.map((p) => ({ label: p.label, to: p.to })),
    },
    {
      label: footerTitles.value.social,
      children: socials.value.map((s) => ({ label: s.name, to: s.url, target: '_blank' })),
    },
    {
      label: footerTitles.value.legal,
      children: footerLegal.value.map((l) => ({ label: l.label, to: l.to, target: l.target })),
    },
  ])
</script>

<template>
  <USeparator icon="efreipara:parachute" class="h-px" />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <!-- Slots left / right inutilisés : pas de grille xl à trois colonnes, colonnes en grille simple -->
        <UFooterColumns
          :columns="columns"
          :ui="{
            root: 'xl:block',
            center: 'grid grid-flow-row grid-cols-2 gap-8 lg:grid-cols-4',
          }"
        />
      </UContainer>
    </template>

    <template #left>
      <div class="flex flex-col">
        <p class="text-muted text-sm">
          &copy; {{ new Date().getFullYear() }}
          <UIcon name="efreipara:parachute" class="mx-1 h-3 w-3" />
          {{ footerTitles.copyright }}
        </p>
        <p class="text-muted text-sm">
          {{ footerTitles.code.label }}
          <a
            :href="`${club.github.repo}/blob/main/CHANGELOG.md`"
            target="_blank"
            :aria-label="fillLabel(footerTitles.code.changelog, { version })"
            class="text-xs"
          >
            (v{{ version }})
          </a>
          :
          <a :href="footerTitles.code.url">{{ footerTitles.code.license }}</a>
        </p>
        <p class="text-muted text-sm">
          {{ footerTitles.content.label }}
          <a :href="footerTitles.content.url">
            {{ footerTitles.content.license }}
            <UIcon name="creativecommons:cc" class="ml-0.5 h-4 w-4" />
            <UIcon name="creativecommons:by" class="ml-0.5 h-4 w-4" />
            <UIcon name="creativecommons:nc" class="ml-0.5 h-4 w-4" />
          </a>
        </p>
        <p class="text-muted text-sm">
          {{ footerTitles.media }}
        </p>
      </div>
    </template>

    <template #right>
      <UButton
        :to="footerTitles.school.url"
        target="_blank"
        :aria-label="footerTitles.school.label"
        color="neutral"
        variant="ghost"
        class="text-muted rounded-full p-2"
      >
        <Icon
          name="efrei:logo"
          aria-hidden="true"
          class="pointer-events-none h-5 w-14 select-none"
        />
      </UButton>
      <span aria-hidden="true" class="bg-accented h-4 w-px" />
      <UButton
        v-for="social in socials"
        :key="social.name"
        :to="social.url"
        target="_blank"
        :icon="social.icon"
        :aria-label="fillLabel(labels.socialLink, { name: social.name })"
        color="neutral"
        variant="ghost"
        class="text-muted rounded-full p-2"
      />
    </template>
  </UFooter>
</template>
