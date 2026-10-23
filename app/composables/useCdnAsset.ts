export const useCdnAsset = () => {
  const config = useRuntimeConfig()

  const buildCdnUrl = (path: string) =>
    resolveCdnUrl({
      baseUrl: String(config.public.cdnUrl || ''),
      devToken: String(config.public.cdnDevToken || ''),
      isDev: import.meta.dev,
      path,
    })

  return {
    buildCdnUrl,
  }
}
