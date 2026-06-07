<script setup lang="ts">
  import type { ActivityType } from '~/composables/useActivities'

  const activities: ActivityType[] = ['oa', 'tandem', 'soufflerie', 'pac']

  definePageMeta({
    validate: (route) => activities.includes(route.params.activite as ActivityType),
  })

  const route = useRoute()
  const activite = route.params.activite as ActivityType
</script>

<template>
  <ActivitePage :activite="activite" />
</template>
