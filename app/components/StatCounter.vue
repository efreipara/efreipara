<script setup lang="ts">
  const props = defineProps<{
    value: string | number
  }>()

  // Durée de l'animation en secondes
  const ANIMATION_DURATION_SEC = 2.5

  const parsed = computed(() => {
    const str = String(props.value)
    const match = str.match(/^(\d+)(.*)$/)
    if (!match) return { num: 0, suffix: str }
    return { num: parseInt(match[1] ?? '0', 10), suffix: match[2] ?? '' }
  })

  const displayValue = ref(String(props.value))
  const el = useTemplateRef<HTMLElement>('el')
  let animationFrame: number | null = null

  function animate() {
    const { num, suffix } = parsed.value
    const duration = ANIMATION_DURATION_SEC * 1000
    const start = performance.now()

    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      displayValue.value = Math.round(eased * num) + suffix
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      }
    }

    animationFrame = requestAnimationFrame(step)
  }

  onMounted(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect()
          animate()
        }
      },
      { threshold: 0.5 },
    )

    if (el.value) observer.observe(el.value)
  })

  onUnmounted(() => {
    if (animationFrame) cancelAnimationFrame(animationFrame)
  })
</script>

<template>
  <span ref="el">{{ displayValue }}</span>
</template>
