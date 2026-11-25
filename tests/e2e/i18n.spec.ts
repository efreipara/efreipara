import { readYaml } from '../content/helpers'
import { expect, gotoReady, test } from './fixtures'
import { isPublished } from './routes'

type Navigation = { languageSwitch: { label: string; ariaLabel: string } }
const fr = readYaml<Navigation>('global/navigation.yml')
const en = readYaml<Navigation>('global/navigation.yml', 'en')
const labels = readYaml<{ legal: { untranslated: string } }>('global/labels.yml', 'en')

test.describe('langues', () => {
  test.skip(!isPublished('en'), 'version anglaise désactivée (LOCALES, enabled)')

  test('le bouton de langue affiche la langue en cours et mène à l’autre, et retour', async ({
    page,
  }) => {
    await gotoReady(page, '/activites/tandem')
    const toEnglish = page.getByRole('link', { name: fr.languageSwitch.ariaLabel })
    await expect(toEnglish).toHaveText('FR')
    await toEnglish.click()
    await expect(page).toHaveURL(/\/en\/activities\/tandem$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('h1')).toHaveText('Tandem jump')

    const toFrench = page.getByRole('link', { name: en.languageSwitch.ariaLabel })
    await expect(toFrench).toHaveText('EN')
    await toFrench.click()
    await expect(page).toHaveURL(/\/activites\/tandem$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  })

  test('les liens écrits par le code prennent l’adresse traduite', async ({ page }) => {
    await gotoReady(page, '/en/activities/soufflerie')
    // Précédent / suivant (grand écran), cartes et menus : jamais /activites/ sous /en
    // Sauf le bouton de langue (hreflang), qui mène à la page française
    await expect(
      page.locator(
        'a[href^="/en/activites"]:not([hreflang]), a[href^="/activites"]:not([hreflang])',
      ),
    ).toHaveCount(0)
    await expect(page.locator('a[href="/en/activities/tandem"]').first()).toBeAttached()
  })

  test('une page légale non traduite affiche le texte français, signalé', async ({ page }) => {
    await gotoReady(page, '/en/rgpd')
    await expect(page.getByText(labels.legal.untranslated)).toBeVisible()
    await expect(page.locator('main [lang="fr"]').first()).toBeAttached()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })
})

test.describe('langue unique', () => {
  test.skip(isPublished('en'), 'version anglaise publiée')

  test('sans autre langue publiée : ni bouton de langue, ni adresses /en', async ({ page }) => {
    await gotoReady(page, '/activites/tandem')
    await expect(page.getByRole('link', { name: fr.languageSwitch.ariaLabel })).toHaveCount(0)
    await expect(page.locator('a[href^="/en"]')).toHaveCount(0)
    const response = await page.goto('/en')
    expect(response?.status()).toBe(404)
  })
})
