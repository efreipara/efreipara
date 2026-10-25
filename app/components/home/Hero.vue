<script setup lang="ts">
  defineProps<{
    links: { label: string; to: string; icon: string }[]
    scrollIcon: string
    video: { pause: { label: string; icon: string }; play: { label: string; icon: string } }
  }>()

  const { buildCdnUrl } = useCdnAsset()
  const videoUrl = buildCdnUrl('main-hero.mp4')

  const { data: seo } = useNuxtData('seo')
  const description = computed(() => seo.value?.pages['index']?.description)
  const siteName = computed(() => seo.value?.defaults.siteName)

  // Pas d'attribut autoplay : la lecture attend le montage, pour respecter « réduire les animations »
  const videoEl = useTemplateRef<HTMLVideoElement>('heroVideo')
  const playing = ref(false)

  const play = () => videoEl.value?.play().catch(() => (playing.value = false))
  const togglePlay = () => (playing.value ? videoEl.value?.pause() : play())

  onMounted(() => {
    if (!prefersReducedMotion()) play()
  })
</script>

<template>
  <section class="main-hero-card relative overflow-hidden" style="view-transition-name: home-hero">
    <div
      class="relative flex items-center justify-center"
      style="height: calc(100svh - var(--ui-header-height, 80px))"
    >
      <video
        ref="heroVideo"
        loop
        muted
        playsinline
        class="absolute inset-0 h-full w-full object-cover"
        poster="~/assets/images/main-hero.jpg"
        @play="playing = true"
        @pause="playing = false"
      >
        <source v-if="videoUrl" :src="videoUrl" type="video/mp4" />
      </video>

      <!-- Voile sombre pour la lisibilité du texte, épargné par le contraste élevé -->
      <div class="no-contrast absolute inset-0 bg-black/30" />

      <div class="relative z-10 mx-auto w-full max-w-4xl px-6 text-center text-white">
        <h1 class="mb-6">
          <span class="sr-only">{{ siteName }}</span>
          <Icon
            name="efreipara:efreipara"
            aria-hidden="true"
            class="hero-slide-up inline-block aspect-512/65 h-auto w-full max-w-78.75 drop-shadow-md sm:max-w-96 md:max-w-126 lg:max-w-157.5"
            style="animation-delay: 0.05s"
          />
        </h1>
        <p
          v-if="description"
          class="hero-slide-up mb-8 text-lg leading-relaxed drop-shadow-md md:text-xl"
          style="animation-delay: 0.15s"
        >
          {{ description }}
        </p>
        <div
          class="hero-slide-up flex flex-wrap justify-center gap-4"
          style="animation-delay: 0.25s"
        >
          <UButton
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            size="xl"
            color="neutral"
            variant="soft"
            :icon="link.icon"
            class="rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
          >
            {{ link.label }}
          </UButton>
        </div>
      </div>

      <div class="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <Icon :name="scrollIcon" class="h-8 w-8 text-white drop-shadow-lg" />
      </div>

      <UButton
        v-if="videoUrl"
        :icon="playing ? video.pause.icon : video.play.icon"
        :aria-label="playing ? video.pause.label : video.play.label"
        color="neutral"
        variant="ghost"
        class="absolute right-3 bottom-3 z-10 cursor-pointer rounded-full bg-black/30 p-2 text-white hover:bg-black/50 focus-visible:ring-2 focus-visible:ring-white"
        @click="togglePlay"
      />
    </div>
  </section>
</template>
