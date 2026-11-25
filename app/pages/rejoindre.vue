<script setup lang="ts">
  const { t } = await useT('rejoindre')
  const joinOptions = computed(() => t.options ?? [])
  const { getSocial } = await useClub()
  const discord = computed(() => getSocial('discord'))
  const { cdnImage } = useCdnAsset()
  const appConfig = useAppConfig()
</script>

<template>
  <div>
    <SharedPageHero
      :headline="t.hero.headline"
      :title="t.hero.title"
      :description="t.hero.description"
    />

    <UContainer class="py-12 sm:py-16">
      <UAlert
        :title="t.alert.title"
        :description="t.alert.description"
        :actions="[
          {
            label: t.alert.actionLabel,
            to: discord?.url,
            target: '_blank',
            icon: discord?.icon,
            variant: 'primary',
            size: 'md',
          },
        ]"
        color="neutral"
        variant="outline"
        orientation="horizontal"
        class="border-discord/20 bg-discord/10 text-default mb-12 rounded-2xl border p-6 ring-0"
        :ui="{
          root: 'flex-col items-stretch gap-4 sm:flex-row sm:items-center',
          title: 'mb-0.5 text-base font-bold',
          description: 'text-muted mt-0 opacity-100',
          actions: 'flex-col items-stretch sm:flex-row sm:items-center',
        }"
      >
        <template #leading>
          <div class="bg-discord/20 flex size-12 shrink-0 items-center justify-center rounded-xl">
            <UIcon :name="discord?.icon" class="text-discord size-6" />
          </div>
        </template>
      </UAlert>

      <div class="grid gap-6 sm:grid-cols-2">
        <UPageCard
          v-for="option in joinOptions"
          :key="option.slug"
          :to="option.link"
          target="_blank"
          :title="option.title"
          class="group"
          :class="activityClass(option.type)"
          :ui="{
            root: 'overflow-hidden rounded-2xl duration-200 active:scale-[0.98]',
            container: 'gap-0 p-0 sm:p-0 lg:flex',
            wrapper: 'items-stretch',
            header: 'mb-0 aspect-video overflow-hidden',
            body: 'flex flex-col p-8',
          }"
        >
          <template #header>
            <img
              v-bind="cdnImage(`rejoindre/${option.slug}`, 'pair')"
              alt=""
              fetchpriority="high"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </template>
          <template #body>
            <h2 class="font-title text-highlighted mb-3 flex items-center gap-2.5 text-2xl">
              <UIcon :name="option.icon" class="text-activity size-6 shrink-0" />
              {{ option.title }}
            </h2>
            <p class="text-muted mb-8 flex-1">{{ option.description }}</p>
            <div class="text-activity-strong flex items-center gap-1.5 font-semibold">
              <span>{{ option.linkText }}</span>
              <UIcon
                :name="appConfig.ui.icons.external"
                class="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </div>
          </template>
        </UPageCard>
      </div>
    </UContainer>

    <SharedSection
      v-if="t.why"
      :headline="t.why.headline"
      :title="t.why.title"
      orientation="horizontal"
      band
    >
      <template #body>
        <ul class="flex flex-col gap-6">
          <UPageFeature
            v-for="feature in t.why.features"
            :key="feature.title"
            as="li"
            :icon="feature.icon"
            :title="feature.title"
            :description="feature.description"
            :class="activityClass(feature.type)"
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
  </div>
</template>
