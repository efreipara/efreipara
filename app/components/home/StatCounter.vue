<script setup lang="ts">
  const props = defineProps<{
    value: string | number
  }>()

  const ANIMATION_DURATION_SEC = 2.5

  const parsed = computed(() => parseStatValue(props.value))

  const displayValue = ref(String(props.value))
  const el = useTemplateRef<HTMLElement>('el')
  let animationFrame: number | null = null

  function animate() {
    const { num, suffix } = parsed.value
    const duration = ANIMATION_DURATION_SEC * 1000
    const start = performance.now()

    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      displayValue.value = Math.round(eased * num) + suffix
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      }
    }

    animationFrame = requestAnimationFrame(step)
  }

  onMounted(() => {
    if (prefersReducedMotion()) return

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
