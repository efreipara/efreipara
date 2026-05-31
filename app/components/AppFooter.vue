<script setup lang="ts">
  // Récupération des données des réseaux sociaux
  const { socials } = useSocials()

  // Organisation du footer en 4 colonnes : Activités, Club, Réseaux, Légal
  const columns = [
    {
      label: 'Activités',
      children: [
        {
          label: 'Nos activités',
          to: '/activites',
        },
        {
          label: 'Saut en OA',
          to: '/activites/oa',
        },
        {
          label: 'Saut en Tandem',
          to: '/activites/tandem',
        },
        {
          label: 'Soufflerie',
          to: '/activites/soufflerie',
        },
        {
          label: 'PAC',
          to: '/activites/pac',
        },
      ],
    },
    {
      label: 'Club',
      children: [
        {
          label: 'À propos',
          to: '/about',
        },
        {
          label: 'Documents',
          to: '/documents',
        },
        {
          label: 'Galeries photos',
          to: '/galeries',
        },
        {
          label: 'Nous contacter',
          to: '/contact',
        },
        {
          label: 'FAQ',
          to: '/faq',
        },
      ],
    },
    {
      label: 'Réseaux',
      children: socials.map((social) => ({
        label: social.name,
        to: social.url,
        target: '_blank',
      })),
    },
    {
      label: 'Légal',
      children: [
        {
          label: 'Mentions légales',
          to: '/mentions-legales',
        },
        {
          label: 'Règlement',
          to: '/reglement',
        },
        {
          label: 'RGPD',
          to: '/rgpd',
        },
        {
          label: 'Statut du site',
          to: 'https://status.efreipara.fr',
          target: '_blank',
        },
      ],
    },
  ]
</script>

<template>
  <!-- Séparateur visuel avec icône parachute -->
  <USeparator icon="efreipara:parachute" class="h-px" />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <!-- Colonnes de navigation du footer -->
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns" />
      </UContainer>
    </template>

    <!-- Section gauche : Copyright et informations de licence -->
    <template #left>
      <div class="flex flex-col">
        <p class="text-muted text-sm">
          &copy; {{ new Date().getFullYear() }}
          <UIcon name="efreipara:parachute" class="mx-1 h-3 w-3" />
          Efrei Para
        </p>
        <p class="text-muted text-sm">
          Code source :
          <a href="https://opensource.org/license/MIT">MIT</a>
        </p>
        <p class="text-muted text-sm">
          Contenus :
          <a href="https://creativecommons.org/licenses/by-nc/4.0/">
            CC BY-NC 4.0 (sauf mention contraire)
            <UIcon name="creativecommons:cc" class="ml-0.5 h-4 w-4" />
            <UIcon name="creativecommons:by" class="ml-0.5 h-4 w-4" />
            <UIcon name="creativecommons:nc" class="ml-0.5 h-4 w-4" />
          </a>
        </p>
        <p class="text-muted text-sm">
          Photos, vidéos & logos : Tous droits réservés / All rights reserved.
        </p>
      </div>
    </template>

    <!-- Section droite : Boutons des réseaux sociaux -->
    <template #right>
      <UButton
        to="https://www.efrei.fr"
        target="_blank"
        aria-label="Efrei"
        color="neutral"
        variant="ghost"
        class="rounded-full p-2"
      >
        <Icon
          name="efrei:logo"
          aria-hidden="true"
          class="pointer-events-none h-5 w-14 select-none"
        />
      </UButton>
      <span aria-hidden="true" class="bg-accented h-4 w-px" />
      <UButton
        v-for="social in socials"
        :key="social.name"
        :to="social.url"
        target="_blank"
        :icon="social.icon"
        :aria-label="`${social.name} Efrei Para`"
        color="neutral"
        variant="ghost"
        class="rounded-full p-2"
      />
    </template>
  </UFooter>
</template>
