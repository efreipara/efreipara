<script setup lang="ts">
  import { isActivity, type ActivityType } from '~/utils/activities'

  definePageMeta({
    validate: (route) => isActivity(route.params.activite),
  })

  const route = useRoute()
  const activite = route.params.activite as ActivityType
</script>

<template>
  <ActivitePage :activite="activite" />
</template>
