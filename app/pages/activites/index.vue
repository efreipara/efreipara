<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const { getIcon } = useEventIcon()
const { buildCdnUrl } = useCdnAsset()
const appConfig = useAppConfig()

// Détection de la taille d'écran pour appliquer reverse uniquement sur grand écran
const isLargeScreen = ref(false)

onMounted(() => {
  const checkScreenSize = () => {
    isLargeScreen.value = window.innerWidth >= 1024 // lg breakpoint
  }
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  onUnmounted(() => window.removeEventListener('resize', checkScreenSize))
})

const oaFeatures = ref([
  {
    title: 'Encadrement professionnel',
    description: 'Instructeurs diplômés et procédures standardisées pour un saut sûr et fluide.',
    icon: 'i-tabler-user-check',
    class: 'text-efreipara-oa',
  },
  {
    title: 'Sensations garanties',
    description: 'La vraie sortie d’avion : vent, altitude et montée d’adrénaline au rendez-vous.',
    icon: 'i-tabler-parachute',
    class: 'text-efreipara-oa',
  },
  {
    title: 'Briefing complet',
    description: 'Tout est expliqué avant le saut : position, sécurité, gestes essentiels.',
    icon: 'i-tabler-book',
    class: 'text-efreipara-oa',
  },
  {
    title: 'Accessible à tous',
    description: 'Pas besoin d’expérience - juste l’envie de découvrir le ciel.',
    icon: 'i-tabler-mood-happy',
    class: 'text-efreipara-oa',
  },
])

const tandemFeatures = ref([
  {
    title: "Saut à 4000 m d'altitude",
    description: 'Décollage, vue panoramique et sortie de l’avion en binôme.',
    icon: 'i-tabler-plane-tilt',
    class: 'text-efreipara-tandem',
  },
  {
    title: '200km/h de sensations',
    description: 'Chute libre d’une cinquantaine de secondes - intense et magique.',
    icon: 'i-tabler-gauge',
    class: 'text-efreipara-tandem',
  },
  {
    title: 'Souvenir possible',
    description: 'Option vidéo/photos pour revivre ton saut.',
    icon: 'i-tabler-video',
    class: 'text-efreipara-tandem',
  },
  {
    title: '100% accessible',
    description: 'Aucune expérience nécessaire, tout est géré par le moniteur.',
    icon: 'i-tabler-mood-happy',
    class: 'text-efreipara-tandem',
  },
])

const soufflerieFeatures = ref([
  {
    title: 'Sensations réelles',
    description: 'Le même flux d’air qu’en chute libre, sans altitude ni stress.',
    icon: 'i-tabler-wind',
    class: 'text-efreipara-soufflerie',
  },
  {
    title: 'Fun & accessible',
    description: 'Idéal pour une première approche ou pour s’amuser entre amis.',
    icon: 'i-tabler-mood-happy',
    class: 'text-efreipara-soufflerie',
  },
  {
    title: 'Progression rapide',
    description: 'En quelques vols, tu comprends la position, l’équilibre et la stabilité.',
    icon: 'i-tabler-target',
    class: 'text-efreipara-soufflerie',
  },
  {
    title: 'Parfait pour l’hiver',
    description: 'L’activité indoor qui prolonge la saison du parachutisme.',
    icon: 'i-tabler-snowflake',
    class: 'text-efreipara-soufflerie',
  },
])

const pacFeatures = ref([
  {
    title: 'Formation complète',
    description:
      'Théorie, séances au sol et plusieurs sauts accompagnés pour acquérir les bases du vol libre.',
    icon: 'i-tabler-school',
    class: 'text-efreipara-pac',
  },
  {
    title: 'Objectifs techniques',
    description:
      'Tu apprends la stabilité, la gestuelle, le pilotage et la gestion de ton parachute.',
    icon: 'i-tabler-target',
    class: 'text-efreipara-pac',
  },
  {
    title: 'Autonomie progressive',
    description:
      'À chaque saut, tu gagnes en confiance jusqu’à savoir ouvrir et contrôler ta voile seul.e.',
    icon: 'i-tabler-parachute',
    class: 'text-efreipara-pac',
  },
  {
    title: 'Engagement progressif',
    description:
      'Chaque étape te fait avancer vers une autonomie totale, encadrée par des moniteurs expérimentés.',
    icon: 'i-tabler-stairs',
    class: 'text-efreipara-pac',
  },
])

const oaLink: ButtonProps[] = [
  {
    label: 'Découvrir le saut en OA',
    to: '/activites/oa',
    color: 'neutral',
    variant: 'subtle',
    trailingIcon: appConfig.ui.icons.arrowRight,
  },
]

const tandemLink: ButtonProps[] = [
  {
    label: 'Découvrir le saut en tandem',
    to: '/activites/tandem',
    color: 'neutral',
    variant: 'subtle',
    trailingIcon: appConfig.ui.icons.arrowRight,
  },
]

const soufflerieLink: ButtonProps[] = [
  {
    label: 'Découvrir le baptême en soufflerie',
    to: '/activites/soufflerie',
    color: 'neutral',
    variant: 'subtle',
    trailingIcon: appConfig.ui.icons.arrowRight,
  },
]

const pacLink: ButtonProps[] = [
  {
    label: 'Découvrir la formation PAC',
    to: '/activites/pac',
    color: 'neutral',
    variant: 'subtle',
    trailingIcon: appConfig.ui.icons.arrowRight,
  },
]
</script>

<template>
  <div>
    <UPageHero
      title="Nos activités"
      description="Découvrez les sensations uniques du parachutisme avec Efrei Para"
    />
    <UPageSection
      title="Saut en ouverture automatique (OA)"
      description="Ton premier vrai saut en parachute - intense, encadré, inoubliable."
      orientation="horizontal"
      :icon="getIcon('oa')"
      :features="oaFeatures"
      :links="oaLink"
      :ui="{
        leadingIcon: 'text-efreipara-oa size-10 shrink-0',
        container: 'pt-0!',
      }"
    >
      <img
        :src="buildCdnUrl('oa.jpg')"
        alt="Saut en ouverture automatique (OA) avec Efrei Para"
        class="w-full rounded-lg"
      />
    </UPageSection>
    <UPageSection
      title="Sauts en tandem"
      description="L’expérience ultime - un saut avec 50 secondes de chute libre avec un.e pro."
      orientation="horizontal"
      :icon="getIcon('tandem')"
      :features="tandemFeatures"
      :links="tandemLink"
      :ui="{ leadingIcon: 'text-efreipara-tandem size-10 shrink-0' }"
      :reverse="isLargeScreen"
    >
      <img
        :src="buildCdnUrl('tandem.jpg')"
        alt="Sauts en tandem avec Efrei Para"
        class="w-full rounded-lg"
      />
    </UPageSection>
    <UPageSection
      title="Baptêmes en soufflerie"
      description="Vole sans parachute : la chute libre, version indoor."
      orientation="horizontal"
      :icon="getIcon('soufflerie')"
      :features="soufflerieFeatures"
      :links="soufflerieLink"
      :ui="{ leadingIcon: 'text-efreipara-soufflerie size-10 shrink-0' }"
    >
      <img
        :src="buildCdnUrl('soufflerie.jpg')"
        alt="Baptêmes en soufflerie avec Efrei Para"
        class="w-full rounded-lg"
      />
    </UPageSection>
    <UPageSection
      title="Formations PAC"
      description="Deviens parachutiste autonome - la formation complète vers la liberté du ciel."
      orientation="horizontal"
      :icon="getIcon('pac')"
      :features="pacFeatures"
      :links="pacLink"
      :ui="{ leadingIcon: 'text-efreipara-pac size-10 shrink-0' }"
      :reverse="isLargeScreen"
    >
      <img
        :src="buildCdnUrl('pac.jpg')"
        alt="Formations PAC avec Efrei Para"
        class="w-full rounded-lg"
      />
    </UPageSection>
    <CallToAction />
  </div>
</template>
