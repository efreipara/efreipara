<template>
  <div>
    <ActiviteHero
      activite="pac"
      title="Formations PAC"
      description="Formation complète en Progression Accompagnée en Chute. Devenez parachutiste autonome avec un encadrement professionnel et maîtrisez la chute libre."
      label="PAC"
      alt="Formations PAC avec Efrei Para"
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
