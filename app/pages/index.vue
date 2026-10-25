<script setup lang="ts">
  const { getIcon } = await useActivities()
  const { partners } = await usePartners()
  const { buildCdnUrl } = useCdnAsset()
  const appConfig = useAppConfig()

  const { data: home } = await useAsyncData('home', () => queryCollection('home').first())
  const { data: cards } = await useAsyncData('home-activites', () =>
    queryCollection('activites').select('stem', 'label', 'card').all(),
  )
  const activityCards = computed(() => orderActivities(cards.value ?? []))

  const { data: galerie } = await useAsyncData('galerie', () => queryCollection('galerie').first())
  const latestAlbums = computed(() => filterGallery(galerie.value?.items ?? [], null).slice(0, 3))
  const albumLabels = computed(() => ({
    link: galerie.value?.hero.linkLabel ?? '',
    linkSource: galerie.value?.hero.linkSourceLabel ?? '',
  }))

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
  <div v-if="home">
    <HomeHero
      :links="home.hero.links"
      :scroll-icon="home.hero.scrollIcon"
      :video="home.hero.video"
    />

    <SharedSection
      :headline="home.about.headline"
      :title="home.about.title"
      orientation="horizontal"
    >
      <template #description>
        <div class="space-y-4">
          <MDC
            v-for="paragraph in home.about.paragraphs"
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
            v-for="stat in home.stats"
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
        aria-hidden="true"
        class="hidden w-full max-w-md justify-self-end opacity-90 lg:block dark:opacity-80"
      />
    </SharedSection>

    <SharedSection
      :headline="home.activites.headline"
      :title="home.activites.title"
      :links="sectionLink(home.activites.link)"
      band
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
              :src="buildCdnUrl(`${item.key}.jpg`)"
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
              {{ home.activites.cardLink }}
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
      :headline="home.why.headline"
      :title="home.why.title"
      orientation="horizontal"
      reverse
    >
      <template #body>
        <ul class="flex flex-col gap-6">
          <UPageFeature
            v-for="item in home.why.items"
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
        :src="buildCdnUrl(home.why.image)"
        :alt="home.why.alt"
        loading="lazy"
        class="aspect-4/3 w-full rounded-2xl object-cover"
      />
    </SharedSection>

    <SharedSection
      v-if="latestAlbums.length"
      :headline="home.albums.headline"
      :title="home.albums.title"
      :links="sectionLink(home.albums.link)"
      band
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

    <SharedSection :headline="home.partners.headline" :title="home.partners.title">
      <SharedPartnerLogos :partners="partners" />
    </SharedSection>

    <SharedCallToAction />
  </div>
</template>
