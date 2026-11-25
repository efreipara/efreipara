import { readYaml } from '../content/helpers'
import { expect, gotoReady, test } from './fixtures'

const fr = readYaml<{ languageSwitch: { ariaLabel: string } }>('global/navigation.yml')
const en = readYaml<{ languageSwitch: { ariaLabel: string } }>('global/navigation.yml', 'en')
const labels = readYaml<{ legal: { untranslated: string } }>('global/labels.yml', 'en')

test.describe('langues', () => {
  test('le bouton de langue mène à la même page dans l’autre langue, et retour', async ({
    page,
  }) => {
    await gotoReady(page, '/activites/tandem')
    await page.getByRole('link', { name: fr.languageSwitch.ariaLabel }).click()
    await expect(page).toHaveURL(/\/en\/activities\/tandem$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('h1')).toHaveText('Tandem jump')

    await page.getByRole('link', { name: en.languageSwitch.ariaLabel }).click()
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
