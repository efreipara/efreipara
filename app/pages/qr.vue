<script setup lang="ts">
definePageMeta({
  layout: false,
})
</script>

<template>
  <UApp>
    <ParachuteBg speed="slow" :size="{ min: 14, max: 50 }" :drift="500" :initial-presence="0.7" />
    <div class="flex items-center justify-center min-h-screen p-4 relative z-10">
      <img
        src="~/assets/images/qr.svg"
        alt="QR Code Efrei Para"
        class="w-full h-auto max-w-md max-h-[90vh] object-contain"
      />
    </div>
  </UApp>
</template>
