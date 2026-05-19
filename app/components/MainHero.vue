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
    class="main-hero-card relative overflow-hidden p-0 rounded-none"
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
        class="absolute inset-0 w-full h-full object-cover"
        poster="~/assets/images/main-hero.jpg"
      >
        <source :src="`${cdnUrl}/main-hero.mp4`" type="video/mp4" />
      </video>

      <!-- Overlay sombre pour améliorer la lisibilité du texte -->
      <div class="absolute inset-0 bg-black/30" />

      <!-- Contenu centré : logo et description optionnelle -->

      <div class="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <Icon
          name="i-efreipara-efreipara"
          class="inline-block mb-6 drop-shadow-md h-10 sm:h-12 md:h-16 lg:h-20 w-78.75 sm:w-96 md:w-126 lg:w-157.5"
        />
        <p v-if="description" class="text-lg md:text-xl leading-relaxed drop-shadow-md mb-8">
          {{ description }}
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <UButton
            to="/activites"
            size="xl"
            color="neutral"
            variant="soft"
            :icon="appConfig.efreipara.icons.activites.parachute"
            class="backdrop-blur-sm bg-white/20 hover:bg-white/30 border border-white/30"
          >
            Nos activités
          </UButton>
          <UButton
            to="/rejoindre"
            size="xl"
            color="neutral"
            variant="soft"
            :icon="appConfig.efreipara.icons.rejoindre.rejoindre"
            class="backdrop-blur-sm bg-white/20 hover:bg-white/30 border border-white/30"
          >
            Nous rejoindre
          </UButton>
        </div>
      </div>

      <!-- Icône flèche animée pour inviter à scroller -->
      <div class="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <Icon
          :name="appConfig.efreipara.icons.extras.caretDownFilled"
          class="w-8 h-8 text-white drop-shadow-lg"
        />
      </div>
    </div>
  </UCard>
</template>
