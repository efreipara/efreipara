<script setup lang="ts">
  const { getIcon } = useEventIcon()

  const activite = 'soufflerie'
  const icon = getIcon(activite)
  const { buildCdnUrl } = useCdnAsset()
</script>

<template>
  <div>
    <UContainer>
      <UPageHero
        title="Baptêmes en soufflerie"
        description="Ressentez les sensations uniques de la chute libre en toute sécurité. Apprenez les bases du vol en soufflerie verticale avec des moniteurs diplômés."
        orientation="horizontal"
        :ui="{ title: 'font-title' }"
      >
        <template #headline>
          <div class="text-efreipara-soufflerie flex items-center font-semibold">
            <UIcon :name="icon" class="mr-2 size-4" />
            Soufflerie
          </div>
        </template>
        <img
          :src="buildCdnUrl('soufflerie.jpg')"
          alt="Baptêmes en soufflerie avec Efrei Para"
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
