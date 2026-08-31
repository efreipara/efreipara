<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'

  const props = defineProps<{ activite: ActivityType }>()

  const { getPartnersByActivity } = await usePartners()
  const partners = computed(() => getPartnersByActivity(props.activite))
</script>

<template>
  <UContainer v-if="partners.length" class="py-12">
    <h2 class="font-title mb-8 text-2xl font-bold">Nos partenaires</h2>
    <div class="flex flex-wrap items-center gap-6">
      <NuxtLink
        v-for="partner in partners"
        :key="partner.name"
        :to="partner.url"
        target="_blank"
        class="group overflow-hidden rounded-xl"
      >
        <div
          class="flex h-16 w-40 items-center justify-center bg-white px-5 py-3 transition-transform duration-200 group-hover:scale-105 md:h-20 md:w-52"
        >
          <Icon
            v-if="partner.icon"
            :name="partner.icon"
            :aria-label="partner.name"
            class="no-contrast h-full w-full"
          />
          <img
            v-else-if="partner.logo"
            :src="partner.logo"
            :alt="partner.name"
            class="h-full w-full object-contain"
          />
          <span v-else class="text-sm font-medium text-gray-700">{{ partner.name }}</span>
        </div>
      </NuxtLink>
    </div>
  </UContainer>
</template>
