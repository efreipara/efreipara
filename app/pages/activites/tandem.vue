<script setup lang="ts">
  const { getIcon } = useEventIcon()

  const activite = 'tandem'
  const icon = getIcon(activite)
  const { buildCdnUrl } = useCdnAsset()
</script>

<template>
  <div>
    <UContainer>
      <UPageHero
        title="Saut en Tandem"
        description="Faites votre premier saut en parachute ! Vivez 50 secondes de chute libre à 4000m d'altitude, attaché à un moniteur professionnel. Aucune expérience requise."
        orientation="horizontal"
        :ui="{ title: 'font-title' }"
      >
        <template #headline>
          <div class="text-efreipara-tandem flex items-center font-semibold">
            <UIcon :name="icon" class="mr-2 size-4" />
            Tandem
          </div>
        </template>
        <img
          :src="buildCdnUrl('tandem.jpg')"
          alt="Saut en tandem avec Efrei Para"
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
