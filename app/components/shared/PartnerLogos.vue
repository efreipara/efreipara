<script setup lang="ts">
  import type { Partner } from '~/composables/usePartners'

  defineProps<{ partners: Partner[] }>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-6">
    <NuxtLink
      v-for="partner in partners"
      :key="partner.name"
      :to="partner.url"
      target="_blank"
      :aria-label="partner.name"
      class="group overflow-hidden rounded-xl"
    >
      <div
        class="flex h-16 w-40 items-center justify-center bg-white px-5 py-3 transition-transform duration-200 group-hover:scale-105 md:h-20 md:w-52"
      >
        <Icon
          v-if="partner.icon"
          :name="partner.icon"
          aria-hidden="true"
          class="no-contrast h-full w-full"
        />
        <img
          v-else-if="partner.logo"
          :src="partner.logo"
          alt=""
          loading="lazy"
          class="no-contrast h-full w-full object-contain"
        />
        <span v-else class="text-sm font-medium text-gray-700">{{ partner.name }}</span>
      </div>
    </NuxtLink>
  </div>
</template>
