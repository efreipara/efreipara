<script setup lang="ts">
  defineOptions({ inheritAttrs: false })

  const colorMode = useColorMode()
  const appConfig = useAppConfig()

  const isDark = computed({
    get() {
      return colorMode.value === 'dark'
    },
    set(_isDark) {
      colorMode.preference = _isDark ? 'dark' : 'light'
    },
  })
</script>

<template>
  <UButton
    color="neutral"
    variant="ghost"
    :aria-label="isDark ? 'Passer en mode clair' : 'Passer en mode sombre'"
    v-bind="$attrs"
    @click="isDark = !isDark"
  >
    <span class="relative flex size-5 items-center justify-center">
      <Icon
        :name="appConfig.ui.icons.light"
        class="absolute inset-0 m-auto size-5 transition-all duration-300"
        :class="isDark ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'"
      />
      <Icon
        :name="appConfig.ui.icons.dark"
        class="absolute inset-0 m-auto size-5 transition-all duration-300"
        :class="isDark ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'"
      />
    </span>
  </UButton>
</template>
