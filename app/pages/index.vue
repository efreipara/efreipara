<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const { getIcon } = useEventIcon()
const { partners } = usePartners()
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
    class: 'rounded-full',
  },
]

const stats = [
  {
    title: '100+',
    description: 'Membres actifs sur Discord',
    icon: 'i-tabler-users',
  },
  {
    title: '4',
    description: 'Activités proposées',
    icon: getIcon('oa'),
  },
  {
    title: '2016',
    description: 'Année de création du club',
    icon: 'i-tabler-calendar',
  },
]

const whyFeatures = [
  {
    title: 'Accessible à tous',
    description:
      'Aucune expérience requise. Que tu sois débutant ou curieux, on s’occupe de tout : briefing, équipement et encadrement.',
    icon: 'i-tabler-mood-happy',
    class: 'text-efreipara-tandem',
  },
  {
    title: 'Encadrement professionnel',
    description:
      'Tous nos sauts sont organisés avec des moniteurs diplômés dans des centres agréés. La sécurité avant tout.',
    icon: 'i-tabler-shield-check',
    class: 'text-efreipara-oa',
  },
  {
    title: 'Communauté étudiante',
    description:
      'Rejoins une équipe soudée d’étudiants Efrei passionnés. Des événements uniques durant l’année pour vivre des expériences inoubliables ensemble.',
    icon: 'i-tabler-heart',
    class: 'text-efreipara-soufflerie',
  },
]
</script>

<template>
  <div>
    <MainHero description="Défiez la gravité et vivez des sensations uniques avec Efrei Para" />

    <UPageSection
      title="Qui sommes-nous ?"
      icon="i-efreipara-parachute"
      :ui="{ container: 'py-12!', title: 'font-title' }"
    >
      <div class="flex items-center gap-8">
        <div class="flex flex-col gap-4 text-muted">
          <p>
            <b class="text-highlighted">Efrei Para</b> est le club de parachutisme du BDS Efrei,
            fondé en <b class="text-highlighted">2016</b>. Repris en 2023 après l'arrêt lié au
            Covid, le club est aujourd'hui plus actif que jamais avec plus de
            <b class="text-highlighted">100 membres</b> sur le Discord.
          </p>
          <p>
            Nous organisons des <b class="text-highlighted">sauts en tandem</b>, des
            <b class="text-highlighted">baptêmes en soufflerie</b> et des
            <b class="text-highlighted">sauts en OA</b> tout au long de l'année.
          </p>
          <p>
            Notre objectif : rendre le parachutisme accessible aux étudiants dans un cadre sécurisé
            et convivial, sans expérience préalable requise.
          </p>
        </div>
        <img
          src="~/assets/images/avion.svg"
          alt=""
          aria-hidden="true"
          class="hidden md:block w-72 h-auto opacity-75 shrink-0"
        />
      </div>
    </UPageSection>

    <div class="border-y border-default">
      <UContainer>
        <div class="grid grid-cols-3 divide-x divide-default">
          <div
            v-for="stat in stats"
            :key="stat.description"
            class="flex flex-col items-center gap-1 py-10"
          >
            <UIcon :name="stat.icon" class="size-5 text-muted mb-1" />
            <span class="text-4xl md:text-5xl font-bold tracking-tight font-title">{{
              stat.title
            }}</span>
            <span class="text-xs sm:text-sm text-muted text-center px-2">{{
              stat.description
            }}</span>
          </div>
        </div>
      </UContainer>
    </div>

    <UPageSection
      title="Nos activités"
      :features="activitesFeatures"
      :links="activitesLink"
      :ui="{
        features: 'sm:grid-cols-2 lg:grid-cols-2 gap-8 grid',
        title: 'font-title',
      }"
    />

    <UPageSection
      title="Pourquoi Efrei Para ?"
      :features="whyFeatures"
      :ui="{ title: 'font-title' }"
    />

    <div class="border-t border-default">
      <UContainer class="py-12">
        <p class="text-center text-2xl font-title mb-8">Nos partenaires</p>
        <div class="flex flex-wrap justify-center items-center gap-6">
          <NuxtLink
            v-for="partner in partners"
            :key="partner.name"
            :to="partner.url"
            target="_blank"
            class="group overflow-hidden rounded-xl"
          >
            <div class="bg-white px-5 py-3 transition-transform duration-200 group-hover:scale-105">
              <img
                :src="partner.logo"
                :alt="partner.name"
                class="h-10 w-32 md:h-14 md:w-44 object-contain"
              />
            </div>
          </NuxtLink>
        </div>
      </UContainer>
    </div>

    <CallToAction />
  </div>
</template>
