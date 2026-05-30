<script setup lang="ts">
  definePageMeta({
    layout: false,
  })
</script>

<template>
  <UApp>
    <ParachuteBg speed="slow" :size="{ min: 14, max: 50 }" :drift="500" :initial-presence="0.7" />
    <div class="relative z-10 flex min-h-screen items-center justify-center p-4">
      <img
        src="~/assets/images/qr.svg"
        alt="QR Code Efrei Para"
        class="h-auto max-h-[90vh] w-full max-w-md object-contain"
      />
    </div>
  </UApp>
</template>
