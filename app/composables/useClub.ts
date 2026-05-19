/**
 * Types et composables liés au club (réseaux sociaux, contact, rejoindre)
 */

// Réseau social avec son URL et icône
export interface Social {
  name: string
  url: string
  icon: string
}

// Informations de contact du club
export interface Contact {
  email: string
  url: string
  address: string
  mapUrls: {
    google: string
    apple: string
    waze: string
  }
  maintainer: {
    email: string
    url: string
  }
}

// Option pour rejoindre le club (membre ou bureau)
export interface JoinOption {
  title: string
  description: string
  icon: string
  link: string
  linkText: string
  color: string
  slug: string
  ogImage: string
}

/**
 * Composable pour gérer les réseaux sociaux du club
 * Les icônes et URLs sont centralisées dans app.config.ts > socials
 */
export const useSocials = () => {
  const appConfig = useAppConfig()

  const socials: Social[] = [
    { name: 'Discord', url: appConfig.socials.discord.url, icon: appConfig.socials.discord.icon },
    {
      name: 'Instagram',
      url: appConfig.socials.instagram.url,
      icon: appConfig.socials.instagram.icon,
    },
    {
      name: 'LinkedIn',
      url: appConfig.socials.linkedin.url,
      icon: appConfig.socials.linkedin.icon,
    },
    { name: 'Bento', url: appConfig.socials.bento.url, icon: appConfig.socials.bento.icon },
    { name: 'GitHub', url: appConfig.socials.github.url, icon: appConfig.socials.github.icon },
  ]

  const getSocialIcon = (name: string): string | undefined => {
    return socials.find((s) => s.name.toLowerCase() === name.toLowerCase())?.icon
  }

  const getSocialUrl = (name: string): string | undefined => {
    return socials.find((s) => s.name.toLowerCase() === name.toLowerCase())?.url
  }

  return { socials, getSocialIcon, getSocialUrl }
}

/**
 * Composable pour les informations de contact du club
 * Les données sont centralisées dans app.config.ts > contact
 */
export const useContact = () => {
  const appConfig = useAppConfig()
  const contact: Contact = appConfig.contact

  return { contact }
}

/**
 * Composable pour les options de rejoindre le club
 * Les icônes sont centralisées dans app.config.ts > efreipara.icons.rejoindre
 */
export const useJoinOptions = () => {
  const appConfig = useAppConfig()

  const joinOptions: JoinOption[] = [
    {
      title: 'Devenir membre',
      description:
        "Tu veux devenir membre Efrei Para ? Cela te donnera accès à l'espace membre sur notre Discord et d'obtenir des points LXP !",
      icon: appConfig.efreipara.icons.rejoindre.devenirMembre,
      link: 'https://forms.gle/1kAbhqg7K1HSAoE19',
      linkText: 'Remplir le formulaire',
      color: 'text-efreipara-tandem',
      slug: 'devenir-membre',
      ogImage: '/seo/devenir-membre.png',
    },
    {
      title: 'Rejoindre le bureau',
      description:
        "Tu veux t'impliquer davantage ? Candidate pour rejoindre le bureau et participe activement à l'organisation du club.",
      icon: appConfig.efreipara.icons.rejoindre.rejoindreBureau,
      link: 'https://forms.gle/Xz3DZBcAFBhqSkJ48',
      linkText: 'Candidater',
      color: 'text-efreipara-oa',
      slug: 'rejoindre-bureau',
      ogImage: '/seo/rejoindre-bureau.png',
    },
  ]

  const getJoinOptionBySlug = (slug: string): JoinOption | undefined => {
    return joinOptions.find((option) => option.slug === slug)
  }

  return { joinOptions, getJoinOptionBySlug }
}
