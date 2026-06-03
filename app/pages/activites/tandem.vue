<template>
  <div>
    <ActiviteHero
      activite="tandem"
      title="Saut en Tandem"
      description="Faites votre premier saut en parachute ! Vivez 50 secondes de chute libre à 4000m d'altitude, attaché à un moniteur professionnel. Aucune expérience requise."
      label="Tandem"
      alt="Saut en tandem avec Efrei Para"
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
