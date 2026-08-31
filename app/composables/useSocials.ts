/**
 * Types et composable pour les réseaux sociaux du club
 */

export interface Social {
  name: string
  url: string
  icon: string
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
