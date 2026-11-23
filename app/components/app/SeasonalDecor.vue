<script setup lang="ts">
  const { season } = await useSeason()
  const { features } = useAccessibility()

  const show = computed(() => !!season.value && features.value.seasonal)
</script>

<template>
  <ClientOnly>
    <!-- Sous l'en-tête et les menus (z-50), sans interaction ; rien avec « réduire les animations » -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show && season"
        class="seasonal-decor pointer-events-none fixed inset-0 z-40 motion-reduce:hidden print:hidden"
        :data-season="season.key"
      >
        <SharedParachuteBg
          fixed
          class="opacity-70"
          :icon="season.icon"
          :count="season.count"
          :color="season.color"
          :color-dark="season.colorDark"
          speed="slow"
          :size="{ min: 10, max: 20 }"
          :drift="40"
          :initial-presence="0.5"
        />
      </div>
    </Transition>
  </ClientOnly>
</template>
