<script setup lang="ts">
  import type { EventItem } from '~/utils/event'

  const props = defineProps<{
    events: EventItem[]
    /** Accueil : puce de l'activité et « En savoir plus » vers sa page */
    showActivity?: boolean
  }>()

  const { getIcon, byKey, activityPath } = await useActivities()
  const { labels } = await useLabels()
  const { localeProperties } = useI18n()

  const cards = computed(() =>
    props.events.map((event) => ({
      ...event,
      key: `${event.type}-${event.date ?? event.months?.join('-')}-${event.title}`,
      when: formatEventWhen(event, labels.events.or, localeProperties.value.language),
      parts: event.date ? eventDateParts(event.date, localeProperties.value.language) : null,
    })),
  )
</script>

<template>
  <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    <li v-for="event in cards" :key="event.key" :class="activityClass(event.type)">
      <UPageCard
        variant="subtle"
        class="h-full"
        :ui="{
          root: 'rounded-2xl',
          container: 'gap-0 p-5 sm:p-5',
          wrapper: 'w-full',
          body: 'flex w-full flex-1 flex-col gap-5',
        }"
      >
        <template #body>
          <div class="flex items-start gap-4">
            <!-- Pavé de date ; la date complète est lue dans le texte à côté -->
            <div
              class="bg-tint-15 dark:bg-tint-20 text-activity-strong flex size-14 shrink-0 flex-col items-center justify-center rounded-xl"
              aria-hidden="true"
            >
              <template v-if="event.parts">
                <span class="font-title text-2xl leading-none">{{ event.parts.day }}</span>
                <span class="text-xs font-semibold uppercase">{{ event.parts.month }}</span>
              </template>
              <UIcon v-else :name="labels.events.dateIcon" class="text-activity size-6" />
            </div>

            <div class="min-w-0 flex-1">
              <p
                v-if="showActivity"
                class="text-activity-strong mb-1 flex items-center gap-1.5 text-xs font-semibold"
              >
                <UIcon :name="getIcon(event.type)" class="size-3.5" />
                {{ byKey(event.type)?.label }}
              </p>
              <h3 class="font-title text-highlighted text-lg leading-tight text-balance">
                {{ event.title }}
              </h3>
              <div class="text-muted mt-2 flex flex-col gap-1 text-sm">
                <span class="flex items-center gap-1.5">
                  <UIcon :name="labels.events.dateIcon" class="size-4 shrink-0" />
                  <span class="first-letter:uppercase">{{ event.when }}</span>
                </span>
                <span v-if="event.location" class="flex items-center gap-1.5">
                  <UIcon :name="labels.events.locationIcon" class="size-4 shrink-0" />
                  {{ event.location }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2">
            <!-- data-goal-title : événement Plausible « <page> › Inscription », quel que soit l'événement -->
            <UButton
              v-if="event.url"
              :to="event.url"
              target="_blank"
              size="sm"
              variant="primary"
              :label="labels.events.register"
              :trailing-icon="labels.events.registerIcon"
              :aria-label="`${labels.events.register} : ${event.title}`"
              :data-goal-title="labels.events.register"
              data-goal-key="register"
            />
            <p v-else class="text-muted text-sm italic">{{ labels.events.soon }}</p>
            <UButton
              v-if="showActivity"
              :to="activityPath(event.type)"
              size="sm"
              variant="tertiary"
              :label="labels.events.info"
              :leading-icon="getIcon(event.type)"
              :aria-label="`${labels.events.info} : ${byKey(event.type)?.label}`"
            />
          </div>
        </template>
      </UPageCard>
    </li>
  </ul>
</template>
