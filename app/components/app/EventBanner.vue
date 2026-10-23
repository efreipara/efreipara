<script setup lang="ts">
  const { event, getEventInfoUrl, getEventBannerId, shouldShowEvent } = useNextEvent()
  const { getIcon } = useEventIcon()
  const appConfig = useAppConfig()

  const bannerId = computed(() => getEventBannerId())
  const isBannerClosed = ref(false)

  onMounted(() => {
    isBannerClosed.value = sessionStorage.getItem(`banner-${bannerId.value}`) === 'true'
  })

  const showBanner = computed(() => !!event.value && shouldShowEvent() && !isBannerClosed.value)

  const handleClose = () => {
    isBannerClosed.value = true
    if (import.meta.client) {
      sessionStorage.setItem(`banner-${bannerId.value}`, 'true')
    }
  }

  const color = computed(() => activityColor(event.value?.type))

  const colorMode = useColorMode()
  const isDark = computed(() => colorMode.value === 'dark')

  const bannerStyle = computed(() => ({
    backgroundColor: `color-mix(in oklch, ${color.value} ${isDark.value ? '18%' : '10%'}, transparent)`,
    borderBottomColor: `color-mix(in oklch, ${color.value} ${isDark.value ? '35%' : '20%'}, transparent)`,
  }))

  const iconBoxStyle = computed(() => ({
    backgroundColor: `color-mix(in oklch, ${color.value} ${isDark.value ? '30%' : '20%'}, transparent)`,
  }))

  const iconColorStyle = computed(() => ({
    color: color.value,
  }))
</script>

<template>
  <ClientOnly>
    <Transition
      appear
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="-translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-full opacity-0"
    >
      <div v-if="showBanner && event" class="border-b" :style="bannerStyle">
        <UContainer>
          <div class="flex items-center gap-3 py-2.5">
            <div
              class="hidden size-9 shrink-0 items-center justify-center rounded-xl sm:flex"
              :style="iconBoxStyle"
            >
              <UIcon :name="getIcon(event.type)" class="size-4" :style="iconColorStyle" />
            </div>

            <p class="flex-1 truncate text-sm font-bold">{{ event.title }}</p>

            <div class="flex shrink-0 items-center gap-2">
              <UButton
                :to="event.url"
                target="_blank"
                size="sm"
                color="neutral"
                variant="subtle"
                :trailing-icon="appConfig.efreipara.icons.extras.arrowNarrowRight"
                class="cursor-pointer rounded-full"
              >
                Inscription
              </UButton>
              <UButton
                :to="getEventInfoUrl(event.type)"
                size="sm"
                color="neutral"
                variant="ghost"
                :leading-icon="getIcon(event.type)"
                class="hidden cursor-pointer rounded-full sm:flex"
              >
                En savoir plus
              </UButton>
              <UButton
                :icon="appConfig.ui.icons.close"
                color="neutral"
                variant="ghost"
                size="sm"
                class="cursor-pointer rounded-full"
                @click="handleClose"
              />
            </div>
          </div>
        </UContainer>
      </div>
    </Transition>
  </ClientOnly>
</template>
