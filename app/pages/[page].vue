<script setup lang="ts">
  type RedirectKey = 'discord' | 'instagram' | 'devenir-membre' | 'rejoindre-bureau'
  type LegalKey = 'mentions-legales' | 'rgpd' | 'reglement'

  const redirectKeys: RedirectKey[] = ['discord', 'instagram', 'devenir-membre', 'rejoindre-bureau']
  const legalKeys: LegalKey[] = ['mentions-legales', 'rgpd', 'reglement']

  definePageMeta({
    validate: (route) => {
      const page = route.params.page as string
      return redirectKeys.includes(page as RedirectKey) || legalKeys.includes(page as LegalKey)
    },
  })

  const route = useRoute()
  const page = route.params.page as string

  const redirectKey = redirectKeys.find((key) => key === page)
  const legalKey = legalKeys.find((key) => key === page)
</script>

<template>
  <RedirectPage v-if="redirectKey" :redirect-key="redirectKey" />
  <LegalPage v-else-if="legalKey" :slug="legalKey" />
</template>
