<script setup lang="ts">
  const props = defineProps<{ open: boolean; labels: { open: string; close: string } }>()
  defineEmits<{ click: [] }>()

  const appConfig = useAppConfig()

  // UHeader monte ce composant deux fois (header + modal) via createReusableTemplate.
  // On démarre toujours à false pour animer vers l'état réel après le premier paint.
  const localOpen = ref(false)
  const ready = ref(false)

  onMounted(() => {
    requestAnimationFrame(() => {
      ready.value = true
      requestAnimationFrame(() => {
        localOpen.value = props.open
      })
    })
  })

  watch(
    () => props.open,
    (val) => {
      localOpen.value = val
    },
  )
</script>

<template>
  <UButton
    color="neutral"
    variant="ghost"
    :aria-label="localOpen ? labels.close : labels.open"
    class="cursor-pointer rounded-full p-2"
    @click="$emit('click')"
  >
    <span class="relative flex size-5 items-center justify-center">
      <span
        class="absolute inset-0 flex items-center justify-center"
        :class="[
          ready && 'transition-all duration-300',
          localOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100',
        ]"
      >
        <Icon :name="appConfig.ui.icons.menu" class="size-5" />
      </span>
      <span
        class="absolute inset-0 flex items-center justify-center"
        :class="[
          ready && 'transition-all duration-300',
          localOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0',
        ]"
      >
        <Icon :name="appConfig.ui.icons.close" class="size-5" />
      </span>
    </span>
  </UButton>
</template>
