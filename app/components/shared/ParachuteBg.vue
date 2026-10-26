<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      /** Icône à faire tomber */
      icon?: string
      /** Nombre de parachutes */
      count?: number
      /** Couleur (clair, et sombre si colorDark est absent) */
      color?: string
      colorDark?: string
      speed?: 'slow' | 'normal' | 'fast'
      /** Taille min / max en px */
      size?: { min: number; max: number }
      /** Dérive maximale vers la gauche, en px */
      drift?: number
      /** Part (0 à 1) des parachutes déjà en vol au chargement */
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

  const speedFactor = { slow: 2.5, normal: 1.8, fast: 0.75 }[props.speed]
  const rand = (min: number, max: number) => Math.random() * (max - min) + min

  // Tirés au montage : aléatoires au prérendu, ils différeraient de ceux du navigateur
  const drops = ref<Record<string, string>[]>([])
  onMounted(() => {
    drops.value = Array.from({ length: props.count }, () => {
      const duration = rand(8, 18) * speedFactor
      // Délai négatif : l'animation a déjà commencé, le parachute est en vol
      const delay = Math.random() < props.initialPresence ? -rand(0, 1) * duration : rand(0, 10)
      return {
        left: `${Math.random() * 100}vw`,
        '--delay': `${delay}s`,
        '--duration': `${duration}s`,
        '--size': `${rand(props.size.min, props.size.max)}px`,
        '--offsetX': `${-rand(0, props.drift)}px`,
      }
    })
  })
</script>

<template>
  <div class="parachute-bg" :style="{ '--drop-color': currentColor }" aria-hidden="true">
    <span v-for="(style, i) in drops" :key="i" class="drop" :style="style">
      <Icon :name="props.icon" />
    </span>
    <slot />
  </div>
</template>

<style scoped>
  .parachute-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }

  .drop {
    position: absolute;
    top: -12vh;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--size);
    height: var(--size);
    font-size: var(--size);
    animation: fall linear infinite;
    animation-duration: var(--duration);
    animation-delay: var(--delay);
    transform: translateY(-12vh);
    will-change: transform, opacity;
    opacity: 0.85;
    color: var(--drop-color);
  }

  .drop :deep(svg),
  .drop :deep(.icon) {
    width: var(--size) !important;
    height: var(--size) !important;
  }

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

  @media (prefers-reduced-motion: reduce) {
    .drop {
      animation-duration: 1ms;
      animation-iteration-count: 1;
      opacity: 0.2;
    }
  }
</style>
