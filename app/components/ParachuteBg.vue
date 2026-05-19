<script setup lang="ts">
import { computed } from 'vue'

/**
 * Composant d'arrière-plan animé avec des parachutes qui tombent
 * Utilisé pour créer un effet visuel immersif sur les pages
 */

// Configuration de chaque parachute animé
interface Drop {
  left: number // Position horizontale (en vw)
  delay: number // Délai avant le début de l'animation (en s)
  duration: number // Durée de la chute (en s)
  size: number // Taille de l'icône (en px)
  offsetX: number // Dérive horizontale vers la gauche (en px)
}

const props = withDefaults(
  defineProps<{
    /** Nom de l'icône Nuxt Icons (ex: "efreipara-parachute") */
    icon?: string
    /** Nombre d'icônes (densité) */
    count?: number
    /** Couleur des icônes */
    color?: string
    /** Vitesse globale de l'animation */
    speed?: 'slow' | 'normal' | 'fast'
    /** Taille min/max des icônes (en px) */
    size?: { min: number; max: number }
    /** Déviation horizontale max vers la gauche (en px) */
    drift?: number
    /** Ratio (0..1) des parachutes déjà visibles au démarrage */
    initialPresence?: number
  }>(),
  {
    icon: 'efreipara-parachute',
    count: 140,
    color: 'var(--ui-primary)',
    speed: 'normal',
    size: () => ({ min: 14, max: 28 }),
    drift: 24,
    initialPresence: 0,
  },
)

// Multiplicateur de vitesse selon le paramètre speed
const speedMul = computed(() =>
  props.speed === 'slow' ? 2.5 : props.speed === 'fast' ? 0.75 : 1.8,
)

// Génére un nombre aléatoire entre min et max
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

// Génération des parachutes avec propriétés aléatoires au montage du composant
const drops: Drop[] = Array.from({ length: props.count }, () => {
  const duration = rand(8, 18) * speedMul.value
  const alreadyInView = Math.random() < props.initialPresence
  // Si déjà en vue : delay négatif => l'animation a déjà commencé
  const delay = alreadyInView ? -rand(0, 1) * duration : rand(0, 10)
  return {
    left: Math.random() * 100, // Position en vw
    delay,
    duration,
    size: rand(props.size.min, props.size.max),
    offsetX: -rand(0, props.drift), // Dérive légèrement vers la gauche
  }
})
</script>

<template>
  <!-- Conteneur d'arrière-plan avec parachutes animés -->
  <div class="parachute-bg" aria-hidden="true">
    <!-- Génération d'un parachute pour chaque drop -->
    <span
      v-for="(d, i) in drops"
      :key="i"
      class="drop"
      :style="
        {
          left: d.left + 'vw',
          '--delay': d.delay + 's',
          '--duration': d.duration + 's',
          '--size': d.size + 'px',
          '--offsetX': d.offsetX + 'px',
          color: props.color,
        } as any
      "
    >
      <Icon :name="props.icon" :size="d.size" />
    </span>
    <slot />
  </div>
</template>

<style scoped>
/* Conteneur principal en position absolue couvrant tout le parent */
.parachute-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none; /* N'interfère pas avec les clics */
  z-index: 0;
}

/* Style de chaque parachute individuel */
.drop {
  position: absolute;
  top: -12vh; /* Démarre au-dessus du viewport */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--size);
  height: var(--size);
  animation: fall linear infinite;
  animation-duration: var(--duration);
  animation-delay: var(--delay);
  transform: translateY(-12vh);
  will-change: transform, opacity; /* Optimisation des performances */
  opacity: 0.85;
}

/* Redimensionne l'icône SVG */
.drop :deep(svg) {
  width: 100%;
  height: 100%;
}

/* Force la taille sur le composant Icon */
.drop :deep(.icon) {
  width: var(--size) !important;
  height: var(--size) !important;
}

/* Animation de chute (vers le bas) + légère dérive à gauche */
@keyframes fall {
  0% {
    transform: translate(0, -15vh);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--offsetX), 115vh);
    opacity: 0.25;
  }
}

/* Accessibilité : réduire l'animation si demandé par l'utilisateur */
@media (prefers-reduced-motion: reduce) {
  .drop {
    animation-duration: 1ms;
    animation-iteration-count: 1;
    opacity: 0.2;
  }
}
</style>
