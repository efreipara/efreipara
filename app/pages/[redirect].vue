<script setup lang="ts">
  type RedirectKey = 'discord' | 'instagram' | 'devenir-membre' | 'rejoindre-bureau'

  const redirectKeys: RedirectKey[] = ['discord', 'instagram', 'devenir-membre', 'rejoindre-bureau']

  definePageMeta({
    validate: (route) => redirectKeys.includes(route.params.redirect as RedirectKey),
  })

  const route = useRoute()
  const redirectKey = route.params.redirect as RedirectKey
</script>

<template>
  <RedirectPage :redirect-key="redirectKey" />
</template>
