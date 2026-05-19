export const useCdnAsset = () => {
  const config = useRuntimeConfig()

  const baseUrl = String(config.public.cdnUrl || '').replace(/\/+$/, '')
  const devToken = String(config.public.cdnDevToken || '').trim()

  const buildCdnUrl = (path: string) => {
    if (!baseUrl) {
      return ''
    }

    const normalizedPath = path.replace(/^\/+/, '')
    const rawUrl = `${baseUrl}/${normalizedPath}`

    // Token only in local dev and only when explicitly provided.
    if (!import.meta.dev || !devToken) {
      return rawUrl
    }

    const separator = rawUrl.includes('?') ? '&' : '?'
    return `${rawUrl}${separator}token=${encodeURIComponent(devToken)}`
  }

  return {
    buildCdnUrl,
  }
}
