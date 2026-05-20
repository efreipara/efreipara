<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const { getIcon } = useEventIcon()
const appConfig = useAppConfig()

const activitesFeatures = [
  {
    title: 'Sauts en ouverture automatique (OA)',
    description:
      'Découvre le saut “vrai de vrai” : briefing, équipement, sortie d’avion avec ouverture automatique. Accessible et encadré.',
    icon: getIcon('oa'),
    to: '/activites/oa',
    class: 'text-efreipara-oa',
  },
  {
    title: 'Sauts en tandem',
    description:
      'Avec un professionnel expérimenté, profite d’une expérience inoubliable en chute libre à 200km/h à 4000m.',
    icon: getIcon('tandem'),
    to: '/activites/tandem',
    class: 'text-efreipara-tandem',
  },
  {
    title: 'Baptêmes en soufflerie',
    description:
      'Vole dans le tunnel en toute sécurité. Idéal pour débuter, progresser et s’amuser entre amis.',
    icon: getIcon('soufflerie'),
    to: '/activites/soufflerie',
    class: 'text-efreipara-soufflerie',
  },
  {
    title: 'Formations PAC',
    description:
      'La Progression Accompagnée en Chute : une formation complète vers l’autonomie en chute libre.',
    icon: getIcon('pac'),
    to: '/activites/pac',
    class: 'text-efreipara-pac',
  },
]

const activitesLink: ButtonProps[] = [
  {
    label: 'Découvrir toutes nos activités en détail',
    to: '/activites',
    color: 'neutral',
    variant: 'subtle',
    trailingIcon: appConfig.ui.icons.arrowRight,
  },
]
</script>

<template>
  <div>
    <MainHero description="Défiez la gravité et vivez des sensations uniques avec Efrei Para" />
    <UPageSection
      title="Qui sommes-nous ?"
      icon="i-efreipara-parachute"
      :ui="{ description: 'whitespace-pre-line' }"
    >
      <p>
        <b>Efrei Para</b> est le club de parachutisme du BDS Efrei. Nous organisons des
        <b>sauts en ouverture automatique (OA)</b>, des <b>sauts en tandem</b> et des
        <b>baptêmes en soufflerie</b> pendant l'hiver. <br /><br />
        <u>Notre objectif</u> : rendre le parachutisme accessible aux étudiants dans un cadre
        sécurisé et convivial.
      </p>
    </UPageSection>
    <div class="flex justify-center">
      <img src="~/assets/images/avion.svg" alt="Avion" class="w-64 md:w-96 h-auto" />
    </div>
    <UPageSection
      title="Nos activités"
      :features="activitesFeatures"
      :links="activitesLink"
      :ui="{
        features: 'sm:grid-cols-2 lg:grid-cols-2 gap-8 grid',
      }"
    />
    <UPageSection title="Pourquoi Efrei Para ?" orientation="horizontal" />

    <CallToAction />
  </div>
</template>
