<script setup lang="ts">
  // Lien vers la même page dans l'autre langue ; aria-label écrit dans la langue de destination
  defineProps<{ labels: { label: string; ariaLabel: string } }>()

  const { locale, locales } = useI18n()
  const switchLocalePath = useSwitchLocalePath()

  const target = computed(() => locales.value.find((item) => item.code !== locale.value)!)
</script>

<template>
  <!-- locale false : l'adresse vient déjà de switchLocalePath, Nuxt UI ne la re-préfixe pas -->
  <UButton
    :to="switchLocalePath(target.code)"
    :locale="false"
    :hreflang="target.language"
    :lang="target.code"
    :label="labels.label"
    :aria-label="labels.ariaLabel"
    color="neutral"
    variant="ghost"
    class="px-2 font-semibold"
  />
</template>
