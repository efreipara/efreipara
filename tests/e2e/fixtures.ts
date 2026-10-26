import { test as base, expect, type Page } from '@playwright/test'

// Les requêtes hors du site (CDN, Plausible, albums, réseaux) sont coupées : les tests ne
// dépendent ni du réseau ni de CDN_URL. Les erreurs console sont relevées, sauf les
// ressources coupées volontairement.
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page, baseURL }, use) => {
      const errors: string[] = []
      await page.route(
        (url) => !url.href.startsWith(baseURL!),
        (route) => route.abort('blockedbyclient'),
      )
      page.on('console', (message) => {
        if (message.type() !== 'error') return
        if (/Failed to load resource|ERR_BLOCKED_BY_CLIENT/.test(message.text())) return
        errors.push(message.text())
      })
      page.on('pageerror', (error) => errors.push(error.message))
      await use(errors)
    },
    { auto: true },
  ],
})

export { expect }

// Attend que Vue ait hydraté la page : avant, les clics ne font rien
export const gotoReady = async (page: Page, path: string) => {
  const response = await page.goto(path)
  await page.waitForFunction(
    () => !!(document.querySelector('#__nuxt') as { __vue_app__?: unknown } | null)?.__vue_app__,
  )
  return response
}

export const visible = (page: Page, locator: ReturnType<Page['locator']>) =>
  locator.locator('visible=true').first()
