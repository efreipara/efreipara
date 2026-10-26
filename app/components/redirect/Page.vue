<script setup lang="ts">
  // Redirection vers un réseau (redirects.yml › socials) ou vers le formulaire d'une option de
  // « Nous rejoindre » ; un autre slug donne une 404
  const props = defineProps<{ slug: string }>()
  const key = props.slug

  const appConfig = useAppConfig()
  const { getSocial } = await useClub()

  // Couleur de marque de l'icône des redirections vers un réseau
  const brandColor: Record<string, string> = {
    discord: 'text-discord',
    instagram: 'text-instagram',
  }

  const { data: redirectsData } = await useAsyncData('redirects', () =>
    queryCollection('redirects').first(),
  )
  const { data: rejoindreData } = await useAsyncData('rejoindre', () =>
    queryCollection('rejoindre').first(),
  )

  const social = redirectsData.value?.socials[key]
  const network = getSocial(key)
  const option = rejoindreData.value?.options.find((o) => o.slug === key)
  const form = redirectsData.value?.form

  const redirect =
    social && network
      ? { ...social, icon: network.icon, iconColor: brandColor[key], url: network.url }
      : option && form
        ? {
            icon: option.icon,
            iconColor: `${activityClass(option.type)} text-activity`,
            title: option.title,
            redirectText: form.redirectText,
            buttonLabel: form.buttonLabel,
            url: option.link,
          }
        : undefined

  if (!redirect) throw createError({ statusCode: 404 })

  const { icon, iconColor, title, redirectText, buttonLabel, url } = redirect

  // Une option de « Nous rejoindre » porte son titre, sa description et son image de partage
  if (option)
    useSeo(key, {
      title: option.title,
      description: option.description,
      ogImage: option.ogImage,
    })

  // En dev, ajouter ?noRedirect à l'URL pour inspecter la page sans être redirigé
  const route = useRoute()
  const skipRedirect = import.meta.dev && 'noRedirect' in route.query

  onMounted(() => {
    if (!skipRedirect) {
      window.location.href = url
    }
  })
</script>

<template>
  <div>
    <UContainer>
      <div class="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div class="text-center">
          <UIcon :name="icon" class="mx-auto mb-6 h-20 w-20" :class="iconColor" />
          <h1 class="font-title text-highlighted mb-4 text-4xl font-bold sm:text-5xl">
            {{ title }}
          </h1>
          <p class="text-muted mb-8 text-lg">
            {{ redirectText }}
          </p>
          <UButton
            :to="url"
            external
            target="_blank"
            size="xl"
            variant="primary"
            :label="buttonLabel"
            :trailing-icon="appConfig.ui.icons.external"
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>
