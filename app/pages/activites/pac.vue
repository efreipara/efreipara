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
          <div class="flex items-center text-efreipara-pac font-semibold">
            <UIcon :name="icon" class="size-4 mr-2" />
            PAC
          </div>
        </template>
        <img
          :src="buildCdnUrl('pac.jpg')"
          alt="Formations PAC avec Efrei Para"
          class="w-full rounded-lg"
        />
      </UPageHero>
      <div class="text-center my-12">
        <UIcon name="tabler:traffic-cone" class="size-10 text-gray-500" />
        <p class="text-lg text-gray-500">Page en construction</p>
        <UButton :to="`/activites`" class="mt-6" color="neutral" variant="solid">
          Voir nos activités
        </UButton>
      </div> </UContainer
    ><CallToAction />
  </div>
</template>
