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

  const toggle = (event: MouseEvent): void => {
    if (!('startViewTransition' in document)) {
      isDark.value = !isDark.value
      return
    }

    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    const transition = (
      document as Document & { startViewTransition: (cb: () => void) => { ready: Promise<void> } }
    ).startViewTransition(() => {
      isDark.value = !isDark.value
    })

    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
        { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
      )
    })
  }
</script>

<template>
  <UButton
    color="neutral"
    variant="ghost"
    :aria-label="isDark ? 'Passer en mode clair' : 'Passer en mode sombre'"
    v-bind="$attrs"
    @click="toggle($event)"
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

<style>
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
  }

  ::view-transition-new(root) {
    z-index: 9999;
  }

  ::view-transition-old(root) {
    z-index: 1;
  }
</style>
