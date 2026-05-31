<script setup lang="ts">
  // Props optionnelle pour afficher une description sous le logo
  interface Props {
    description?: string
  }

  defineProps<Props>()

  const appConfig = useAppConfig()

  // Récupération de l'URL du CDN pour la vidéo d'arrière-plan
  const config = useRuntimeConfig()
  const cdnUrl = config.public.cdnUrl
</script>

<template>
  <!-- Card hero pleine hauteur avec vidéo en arrière-plan -->
  <UCard
    variant="subtle"
    class="main-hero-card relative overflow-hidden rounded-none p-0"
    :ui="{
      body: 'p-0 sm:p-0',
    }"
  >
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
        <Icon
          name="efreipara:efreipara"
          class="mb-6 inline-block h-10 w-78.75 drop-shadow-md sm:h-12 sm:w-96 md:h-16 md:w-126 lg:h-20 lg:w-157.5"
        />
        <p v-if="description" class="mb-8 text-lg leading-relaxed drop-shadow-md md:text-xl">
          {{ description }}
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <UButton
            to="/activites"
            size="xl"
            color="neutral"
            variant="soft"
            :icon="appConfig.efreipara.icons.activites.parachute"
            class="rounded-full border border-white/30 bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            Nos activités
          </UButton>
          <UButton
            to="/rejoindre"
            size="xl"
            color="neutral"
            variant="soft"
            :icon="appConfig.efreipara.icons.rejoindre.rejoindre"
            class="rounded-full border border-white/30 bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            Nous rejoindre
          </UButton>
        </div>
      </div>

      <!-- Icône flèche animée pour inviter à scroller -->
      <div class="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <Icon
          :name="appConfig.efreipara.icons.extras.caretDownFilled"
          class="h-8 w-8 text-white drop-shadow-lg"
        />
      </div>
    </div>
  </UCard>
</template>
