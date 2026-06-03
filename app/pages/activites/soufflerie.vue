<template>
  <div>
    <ActiviteHero
      activite="soufflerie"
      title="Baptêmes en soufflerie"
      description="Ressentez les sensations uniques de la chute libre en toute sécurité. Apprenez les bases du vol en soufflerie verticale avec des moniteurs diplômés."
      label="Soufflerie"
      alt="Baptêmes en soufflerie avec Efrei Para"
    >
      <div class="my-12 text-center">
        <UIcon name="tabler:traffic-cone" class="size-10 text-gray-500" />
        <p class="text-lg text-gray-500">Page en construction</p>
        <UButton :to="`/activites`" class="mt-6 rounded-full" color="neutral" variant="solid">
          Voir nos activités
        </UButton>
      </div>
    </ActiviteHero>
    <CallToAction />
  </div>
</template>
