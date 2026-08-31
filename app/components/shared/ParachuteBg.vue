<script setup lang="ts">
  import { computed } from 'vue'

  interface Drop {
    left: number
    delay: number
    duration: number
    size: number
    offsetX: number
  }

  const props = withDefaults(
    defineProps<{
      /** Nom de l'icône Nuxt Icons (ex: "efreipara-parachute") */
      icon?: string
      /** Nombre d'icônes (densité) */
      count?: number
      /** Couleur des icônes (light mode, ou les deux si colorDark non défini) */
      color?: string
      /** Couleur des icônes en dark mode (par défaut : identique à color) */
      colorDark?: string
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
      colorDark: undefined,
      speed: 'normal',
      size: () => ({ min: 14, max: 28 }),
      drift: 24,
      initialPresence: 0,
    },
  )

  const colorMode = useColorMode()
  const currentColor = computed(() =>
    colorMode.value === 'dark' ? (props.colorDark ?? props.color) : props.color,
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
  <div class="parachute-bg" :style="{ '--drop-color': currentColor }" aria-hidden="true">
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
    color: var(--drop-color);
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
