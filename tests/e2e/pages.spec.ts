import { expect, gotoReady, test } from './fixtures'
import { pages } from './routes'
import pkg from '../../package.json' with { type: 'json' }

test.describe('pages', () => {
  for (const path of pages) {
    test(`${path} s'affiche sans erreur`, async ({ page, consoleErrors }) => {
      const response = await gotoReady(page, path)
      expect(response?.status()).toBe(200)
      await expect(page).toHaveTitle(/Efrei Para/)

      const canonical = path === '/' ? 'https://efreipara.fr' : `https://efreipara.fr${path}`
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical)
      // Seule l'accueil est indexée
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        path === '/' ? 'index, follow' : /^noindex/,
      )
      expect(await page.locator('h1').count()).toBeLessThanOrEqual(1)
      expect(consoleErrors).toEqual([])
    })
  }
})

test.describe('pied de page', () => {
  test('affiche la version de package.json', async ({ page }) => {
    await gotoReady(page, '/')
    await expect(page.locator('footer').getByRole('link', { name: `v${pkg.version}` })).toHaveText(
      `(v${pkg.version})`,
    )
  })
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

test.describe('référencement et partage', () => {
  test('l’accueil a exactement un titre h1, nommé Efrei Para', async ({ page }) => {
    await gotoReady(page, '/')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveText('Efrei Para')
  })

  for (const path of pages) {
    test(`${path} a une image de partage en URL absolue`, async ({ page }) => {
      await page.goto(path)
      for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]'])
        await expect(page.locator(selector)).toHaveAttribute(
          'content',
          /^https:\/\/efreipara\.fr\/seo\/.+\.png$/,
        )
    })
  }

  test('la page d’erreur a un titre, une langue et n’est pas indexée', async ({ page }) => {
    await gotoReady(page, '/cette-page-nexiste-pas')
    await expect(page).toHaveTitle('Page introuvable - Efrei Para')
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
  })
})
