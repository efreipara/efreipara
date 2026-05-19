<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
import ParachuteBg from './ParachuteBg.vue'

const { buildCdnUrl } = useCdnAsset()

// Récupération des icônes depuis la configuration de l'app
const appConfig = useAppConfig()

// Configuration des boutons d'appel à l'action
const links: ButtonProps[] = [
  {
    label: 'Voir nos activités',
    to: '/activites',
    size: 'lg',
    color: 'neutral',
    variant: 'subtle',
    icon: appConfig.efreipara.icons.activites.parachute,
  },
  {
    label: 'Nous rejoindre',
    to: '/rejoindre',
    size: 'lg',
    color: 'neutral',
    icon: appConfig.efreipara.icons.rejoindre.rejoindre,
  },
]
</script>

<template>
  <USeparator />
  <UPageSection :ui="{ container: 'p-0!' }">
    <!-- Fond de parachutes animés avec densité réduite -->
    <ParachuteBg :count="50" :initial-presence="0.5" speed="slow" color="rgb(255 255 255 / 0.12)" />
    <!-- Section CTA (Call To Action) pour encourager les visiteurs à rejoindre le club -->
    <UPageCTA
      title="Prêt à prendre de la hauteur ?"
      description="Rejoignez l'équipe Efrei Para et vivez une expérience unique dans le monde du parachutisme. Que vous soyez débutant ou confirmé, nous avons une place pour vous."
      orientation="horizontal"
      variant="naked"
      :links="links"
      class="relative"
    >
      <!-- Image depuis le CDN pour de meilleures performances -->
      <img
        :src="buildCdnUrl('rejoindre-bureau.jpg')"
        alt="Efrei Para - Rejoignez-nous"
        class="w-full rounded-lg relative z-10"
      />
    </UPageCTA>
  </UPageSection>
</template>
