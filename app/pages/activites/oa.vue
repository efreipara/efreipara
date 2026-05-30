<script setup lang="ts">
  const { getIcon } = useEventIcon()

  const activite = 'oa'
  const icon = getIcon(activite)
  const { buildCdnUrl } = useCdnAsset()
</script>

<template>
  <div>
    <UContainer>
      <UPageHero
        title="Saut en Ouverture Automatique (OA)"
        description="Vivez l'adrénaline du parachutisme en solo avec un parachute qui s'ouvre automatiquement à la sortie de l'avion."
        orientation="horizontal"
        :ui="{ title: 'font-title' }"
      >
        <template #headline>
          <div class="text-efreipara-oa flex items-center font-semibold">
            <UIcon :name="icon" class="mr-2 size-4" />
            OA
          </div>
        </template>
        <img
          :src="buildCdnUrl('oa.jpg')"
          alt="Saut en ouverture automatique (OA) avec Efrei Para"
          class="w-full rounded-lg"
        />
      </UPageHero>
      <div class="my-12 text-center">
        <UIcon name="tabler:traffic-cone" class="size-10 text-gray-500" />
        <p class="text-lg text-gray-500">Page en construction</p>
        <UButton :to="`/activites`" class="mt-6 rounded-full" color="neutral" variant="solid">
          Voir nos activités
        </UButton>
      </div>
    </UContainer>
    <CallToAction />
  </div>
</template>
