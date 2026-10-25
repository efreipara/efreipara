<script setup lang="ts">
  defineProps<{
    headline?: string
    title?: string
    description?: string
  }>()
</script>

<template>
  <div class="bg-elevated/60">
    <UContainer>
      <UPageHeader>
        <template v-if="headline" #headline>
          <SharedHeadline class="hero-slide-up" style="animation-delay: 0.05s">
            {{ headline }}
          </SharedHeadline>
        </template>
        <template #title>
          <span class="hero-slide-up inline-block" style="animation-delay: 0.08s">{{ title }}</span>
        </template>
        <template v-if="description" #description>
          <span class="hero-slide-up inline-block" style="animation-delay: 0.14s">
            {{ description }}
          </span>
        </template>
      </UPageHeader>
    </UContainer>
  </div>
</template>
