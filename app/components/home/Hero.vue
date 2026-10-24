<script setup lang="ts">
  defineProps<{
    links: { label: string; to: string; icon: string }[]
    scrollIcon: string
  }>()

  const config = useRuntimeConfig()
  const cdnUrl = config.public.cdnUrl

  const { data: seo } = useNuxtData('seo')
  const description = computed(() => seo.value?.pages['index']?.description)
  const siteName = computed(() => seo.value?.defaults.siteName)
</script>

<template>
  <!-- Section hero pleine hauteur avec vidéo en arrière-plan -->
  <section class="main-hero-card relative overflow-hidden" style="view-transition-name: home-hero">
    <!-- Conteneur avec hauteur calculée (viewport - header) -->
    <div
      class="relative flex items-center justify-center"
      style="height: calc(100vh - var(--ui-header-height, 80px))"
    >
      <!-- Vidéo d'arrière-plan en boucle -->
      <video
        autoplay
        loop
        muted
        playsinline
        class="absolute inset-0 h-full w-full object-cover"
        poster="~/assets/images/main-hero.jpg"
      >
        <source :src="`${cdnUrl}/main-hero.mp4`" type="video/mp4" />
      </video>

      <!-- Overlay sombre pour améliorer la lisibilité du texte -->
      <div class="no-contrast absolute inset-0 bg-black/30" />

      <!-- Contenu centré : logo et description optionnelle -->

      <div class="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
        <h1 class="mb-6">
          <span class="sr-only">{{ siteName }}</span>
          <Icon
            name="efreipara:efreipara"
            aria-hidden="true"
            class="hero-slide-up inline-block h-10 w-78.75 drop-shadow-md sm:h-12 sm:w-96 md:h-16 md:w-126 lg:h-20 lg:w-157.5"
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

      <!-- Icône flèche animée pour inviter à scroller -->
      <div class="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <Icon :name="scrollIcon" class="h-8 w-8 text-white drop-shadow-lg" />
      </div>
    </div>
  </section>
</template>
