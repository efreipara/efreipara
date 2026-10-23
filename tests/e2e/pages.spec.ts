import { expect, gotoReady, test } from './fixtures'
import { pages } from './routes'

test.describe('pages', () => {
  for (const path of pages) {
    test(`${path} s'affiche sans erreur`, async ({ page, consoleErrors }) => {
      const response = await gotoReady(page, path)
      expect(response?.status()).toBe(200)
      await expect(page).toHaveTitle(/Efrei Para/)

      const canonical = path === '/' ? 'https://efreipara.fr' : `https://efreipara.fr${path}`
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical)
      expect(await page.locator('h1').count()).toBeLessThanOrEqual(1)
      expect(consoleErrors).toEqual([])
    })
  }
})

test.describe('erreurs', () => {
  test('une adresse inconnue répond 404 avec la page « Page introuvable »', async ({ page }) => {
    const response = await gotoReady(page, '/cette-page-nexiste-pas')
    expect(response?.status()).toBe(404)
    await expect(page.getByText('Page introuvable')).toBeVisible()
    await expect(page.getByRole('link', { name: "Retour à l'accueil" }).first()).toBeVisible()
  })

  test('une activité inconnue affiche aussi « Page introuvable »', async ({ page }) => {
    await gotoReady(page, '/activites/parapente')
    await expect(page.getByText('Page introuvable')).toBeVisible()
  })
})
