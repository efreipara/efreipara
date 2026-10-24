<script setup lang="ts">
  const { socials, club } = await useClub()
  const { version } = useAppConfig()
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
  <!-- Séparateur visuel avec icône parachute -->
  <USeparator icon="efreipara:parachute" class="h-px" />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <!-- Colonnes de navigation du footer -->
    <template #top>
      <UContainer>
        <UFooterColumns
          :columns="columns"
          :ui="{
            root: 'lg:grid lg:grid-cols-2 lg:gap-8 xl:grid-cols-2 xl:gap-8',
            left: 'mb-10 lg:mb-0',
            center:
              'flex-col md:grid auto-cols-fr md:col-span-2 lg:col-span-2 text-center md:text-left grid grid-flow-row grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:col-span-2 sm:max-md:[&>div:nth-child(odd)]:text-end sm:max-md:[&>div:nth-child(odd)_a]:justify-end sm:max-md:[&>div:nth-child(even)]:text-start sm:max-md:[&>div:nth-child(even)_a]:justify-start md:max-lg:[&>div]:text-center md:max-lg:[&>div_a]:justify-center',
            right: 'mt-10 lg:mt-0',
            label: 'text-sm font-semibold',
            list: 'mt-6 space-y-4',
            item: 'relative',
            link: 'group text-sm flex items-center justify-center md:justify-start gap-1.5 focus-visible:outline-primary',
            linkLeadingIcon: 'size-5 shrink-0',
            linkLabel: 'truncate',
            linkLabelExternalIcon: 'size-3 absolute top-0 text-dimmed inline-block',
          }"
        />
      </UContainer>
    </template>

    <!-- Section gauche : Copyright et informations de licence -->
    <template #left>
      <div class="flex flex-col">
        <p class="text-muted text-sm">
          &copy; {{ new Date().getFullYear() }}
          <UIcon name="efreipara:parachute" class="mx-1 h-3 w-3" />
          Efrei Para
        </p>
        <p class="text-muted text-sm">
          Code source
          <a
            :href="`${club.github.repo}/blob/main/CHANGELOG.md`"
            target="_blank"
            :aria-label="`v${version}, historique des versions`"
            class="text-xs"
          >
            (v{{ version }})
          </a>
          :
          <a href="https://opensource.org/license/MIT">MIT</a>
        </p>
        <p class="text-muted text-sm">
          Contenus :
          <a href="https://creativecommons.org/licenses/by-nc/4.0/">
            CC BY-NC 4.0 (sauf mention contraire)
            <UIcon name="creativecommons:cc" class="ml-0.5 h-4 w-4" />
            <UIcon name="creativecommons:by" class="ml-0.5 h-4 w-4" />
            <UIcon name="creativecommons:nc" class="ml-0.5 h-4 w-4" />
          </a>
        </p>
        <p class="text-muted text-sm">
          Photos, vidéos & logos : Tous droits réservés / All rights reserved.
        </p>
      </div>
    </template>

    <!-- Section droite : Boutons des réseaux sociaux -->
    <template #right>
      <UButton
        to="https://www.efrei.fr"
        target="_blank"
        aria-label="Efrei"
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
        :aria-label="`${social.name} Efrei Para`"
        color="neutral"
        variant="ghost"
        class="text-muted rounded-full p-2"
      />
    </template>
  </UFooter>
</template>
