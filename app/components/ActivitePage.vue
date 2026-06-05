<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'

  const props = defineProps<{ activite: ActivityType }>()

  const { data: page } = await useAsyncData(props.activite, () =>
    queryCollection('activites').where('stem', '=', `pages/activites/${props.activite}`).first(),
  )
</script>

<template>
  <div>
    <ActiviteHero
      v-if="page"
      :activite="activite"
      :title="page.title"
      :description="page.description"
      :label="page.label"
      :alt="page.alt"
    />
    <div class="my-12 text-center">
      <UIcon name="tabler:traffic-cone" class="size-10 text-gray-500" />
      <p class="text-lg text-gray-500">Page en construction</p>
      <UButton :to="`/activites`" class="mt-6 rounded-full" color="neutral" variant="solid">
        Voir nos activités
      </UButton>
    </div>
    <CallToAction />
  </div>
</template>
