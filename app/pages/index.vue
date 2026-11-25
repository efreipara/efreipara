<script setup lang="ts">
  const { getIcon, activityPath } = await useActivities()
  const { partners } = await usePartners()
  const { cdnImage } = useCdnAsset()
  const appConfig = useAppConfig()

  const { t } = await useT('home')
  const { data: cards } = await useContentData('activites', {
    key: 'home-activites',
    query: (q) => q.select('stem', 'label', 'card').all(),
  })
  const activityCards = computed(() =>
    orderActivities(cards.value ?? []).map((card) => ({ ...card, to: activityPath(card.key) })),
  )

  const { data: galerie } = await useContentData('galerie')
  const latestAlbums = computed(() => filterGallery(galerie.value?.items ?? [], null).slice(0, 3))
  const albumLabels = computed(() => ({
    link: galerie.value?.hero.linkLabel ?? '',
    linkSource: galerie.value?.hero.linkSourceLabel ?? '',
  }))

  const { events } = await useUpcomingEvents()

  // Sections présentes, dans l'ordre : une sur deux sur bande, la première sur fond clair
  const present = computed(() =>
    (
      [
        ['about', true],
        ['activites', true],
        ['events', events.value.length],
        ['why', true],
        ['albums', latestAlbums.value.length],
        ['partners', true],
      ] as const
    )
      .filter(([, shown]) => !!shown)
      .map(([name]) => name),
  )
  const band = (name: (typeof present.value)[number]) =>
    isBandSection(present.value.indexOf(name), false)

  const sectionLink = (link?: { label: string; to: string }) =>
    link
      ? [
          {
            label: link.label,
            to: link.to,
            variant: 'secondary' as const,
            trailingIcon: appConfig.ui.icons.arrowRight,
          },
        ]
      : []
</script>

<template>
  <div v-if="t.hero">
    <HomeHero :links="t.hero.links" :scroll-icon="t.hero.scrollIcon" :video="t.hero.video" />

    <SharedSection
      :headline="t.about.headline"
      :title="t.about.title"
      orientation="horizontal"
      :band="band('about')"
    >
      <template #description>
        <div class="space-y-4">
          <MDC
            v-for="paragraph in t.about.paragraphs"
            :key="paragraph"
            :value="paragraph"
            tag="p"
            unwrap="p"
            class="[&_strong]:text-highlighted"
          />
        </div>
      </template>
      <template #body>
        <ul class="border-default grid grid-cols-3 border-y">
          <li
            v-for="stat in t.stats"
            :key="stat.description"
            class="border-default flex flex-col gap-1 py-5 not-first:border-l not-first:pl-4 sm:not-first:pl-6"
          >
            <UIcon :name="stat.icon" class="text-muted size-4" />
            <HomeStatCounter
              :value="stat.title"
              class="font-title text-highlighted text-3xl sm:text-4xl"
            />
            <span class="text-muted text-xs sm:text-sm">{{ stat.description }}</span>
          </li>
        </ul>
      </template>
      <img
        src="~/assets/images/avion.svg"
        alt=""
        width="428"
        height="151"
        aria-hidden="true"
        class="hidden w-full max-w-md justify-self-end opacity-90 lg:block dark:opacity-80"
      />
    </SharedSection>

    <SharedSection
      :headline="t.activites.headline"
      :title="t.activites.title"
      :links="sectionLink(t.activites.link)"
      :band="band('activites')"
    >
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <UPageCard
          v-for="item in activityCards"
          :key="item.key"
          :to="item.to"
          :title="item.card.title"
          variant="subtle"
          class="group"
          :class="activityClass(item.key)"
          :ui="{
            root: 'overflow-hidden rounded-2xl duration-200 active:scale-[0.98]',
            container: 'gap-0 p-0 sm:p-0',
            header: 'relative mb-0 aspect-video overflow-hidden lg:aspect-4/5',
            body: 'flex flex-1 flex-col p-5',
          }"
        >
          <template #header>
            <img
              v-bind="cdnImage(`activites/${item.key}`, 'quarter')"
              alt=""
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span
              class="bg-default/90 text-activity-strong absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm"
            >
              <UIcon :name="getIcon(item.key)" class="size-4" />
              {{ item.label }}
            </span>
          </template>
          <template #body>
            <h3 class="font-title text-highlighted mb-2 text-xl text-balance">
              {{ item.card.title }}
            </h3>
            <p class="text-muted mb-5 flex-1 text-sm">{{ item.card.description }}</p>
            <span class="text-activity-strong flex items-center gap-1 text-sm font-semibold">
              {{ t.activites.cardLink }}
              <UIcon
                :name="appConfig.ui.icons.arrowRight"
                class="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </span>
          </template>
        </UPageCard>
      </div>
    </SharedSection>

    <SharedSection
      v-if="events.length"
      id="evenements"
      class="scroll-mt-(--ui-header-height)"
      :headline="t.events.headline"
      :title="t.events.title"
      :band="band('events')"
    >
      <SharedEventList :events="events" show-activity />
    </SharedSection>

    <SharedSection
      :headline="t.why.headline"
      :title="t.why.title"
      orientation="horizontal"
      reverse
      :band="band('why')"
    >
      <template #body>
        <ul class="flex flex-col gap-6">
          <UPageFeature
            v-for="item in t.why.items"
            :key="item.title"
            as="li"
            :icon="item.icon"
            :title="item.title"
            :description="item.description"
            :class="activityClass(item.type)"
            :ui="{
              leading: 'bg-tint-10 size-10 shrink-0 justify-center rounded-xl p-0',
              leadingIcon: 'text-activity size-5',
              title: 'text-highlighted text-base text-wrap',
              description: 'text-wrap',
            }"
          />
        </ul>
      </template>
      <img
        v-bind="cdnImage(t.why.image, 'half')"
        :alt="t.why.alt"
        loading="lazy"
        class="aspect-4/3 w-full rounded-2xl object-cover"
      />
    </SharedSection>

    <SharedSection
      v-if="latestAlbums.length"
      :headline="t.albums.headline"
      :title="t.albums.title"
      :links="sectionLink(t.albums.link)"
      :band="band('albums')"
    >
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SharedAlbumCard
          v-for="item in latestAlbums"
          :key="item.url"
          :item="item"
          :labels="albumLabels"
          :icons="galerie?.albumIcons ?? { date: '', location: '' }"
        />
      </div>
    </SharedSection>

    <SharedSection
      :headline="t.partners.headline"
      :title="t.partners.title"
      :band="band('partners')"
    >
      <SharedPartnerLogos :partners="partners" />
    </SharedSection>

    <SharedCallToAction />
  </div>
</template>
