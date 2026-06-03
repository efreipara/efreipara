<template>
  <div>
    <ActiviteHero
      activite="oa"
      title="Saut en Ouverture Automatique (OA)"
      description="Vivez l'adrénaline du parachutisme en solo avec un parachute qui s'ouvre automatiquement à la sortie de l'avion."
      label="OA"
      alt="Saut en ouverture automatique (OA) avec Efrei Para"
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
