<script setup lang="ts">
  const { getIcon } = useEventIcon()

  const activite = 'pac'
  const icon = getIcon(activite)
  const { buildCdnUrl } = useCdnAsset()
</script>

<template>
  <div>
    <UContainer>
      <UPageHero
        title="Formations PAC"
        description="Formation complète en Progression Accompagnée en Chute. Devenez parachutiste autonome avec un encadrement professionnel et maîtrisez la chute libre."
        orientation="horizontal"
        :ui="{ title: 'font-title' }"
      >
        <template #headline>
          <div class="text-efreipara-pac flex items-center font-semibold">
            <UIcon :name="icon" class="mr-2 size-4" />
            PAC
          </div>
        </template>
        <img
          :src="buildCdnUrl('pac.jpg')"
          alt="Formations PAC avec Efrei Para"
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
