<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'

  const props = defineProps<{ activite: ActivityType }>()

  const { getPartnersByActivity } = await usePartners()
  const partners = computed(() => getPartnersByActivity(props.activite))
</script>

<template>
  <UContainer v-if="partners.length" class="py-12">
    <h2 class="font-title mb-8 text-2xl font-bold">Nos partenaires</h2>
    <SharedPartnerLogos :partners="partners" />
  </UContainer>
</template>
