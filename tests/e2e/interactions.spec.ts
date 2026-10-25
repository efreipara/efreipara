import { readYaml } from '../content/helpers'
import { expect, gotoReady, test, visible } from './fixtures'

const navigation = readYaml<{ accessibilityMenu: { label: string }; logo: { label: string } }>(
  'global/navigation.yml',
)
const accessibilityMenu = navigation.accessibilityMenu.label

test.describe('navigation', () => {
  test('le logo de l’en-tête mène à l’accueil et porte le nom du site', async ({ page }) => {
    await gotoReady(page, '/faq')
    const logo = page.getByRole('banner').getByRole('link', { name: navigation.logo.label })
    await expect(logo).toHaveAttribute('href', '/')
  })

  test('le menu Activités mène à une activité (desktop)', async ({ page, isMobile }) => {
    test.skip(isMobile, 'menu desktop')
    await gotoReady(page, '/')
    await page.getByRole('banner').getByRole('link', { name: 'Nos activités' }).hover()
    await page
      .getByRole('link', { name: /Saut en Tandem/ })
      .first()
      .click()
    await expect(page).toHaveURL(/\/activites\/tandem$/)
  })

  test('le menu burger ouvre la navigation (mobile)', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'menu mobile')
    await gotoReady(page, '/')
    await page.getByRole('button', { name: 'Ouvrir le menu' }).first().click()
    await page.getByRole('dialog').getByRole('link', { name: 'Galerie' }).click()
    await expect(page).toHaveURL(/\/galerie$/)
  })

  test("la page QR n'a ni en-tête ni pied de page", async ({ page }) => {
    await gotoReady(page, '/qr')
    await expect(page.locator('header')).toHaveCount(0)
    await expect(page.locator('footer')).toHaveCount(0)
    await expect(page.getByAltText('QR Code Efrei Para')).toBeVisible()
  })
})

test.describe('thème et accessibilité', () => {
  test.use({ colorScheme: 'light' })

  test('le bouton bascule entre clair et sombre', async ({ page }) => {
    await gotoReady(page, '/')
    const html = page.locator('html')
    await expect(html).not.toHaveClass(/\bdark\b/)
    await visible(page, page.getByRole('button', { name: 'Passer en mode sombre' })).click()
    await expect(html).toHaveClass(/\bdark\b/)
    await visible(page, page.getByRole('button', { name: 'Passer en mode clair' })).click()
    await expect(html).not.toHaveClass(/\bdark\b/)
  })

  test('les options d’accessibilité s’appliquent et restent après rechargement', async ({
    page,
  }) => {
    await gotoReady(page, '/')
    await visible(page, page.getByRole('button', { name: accessibilityMenu })).click()
    await page.getByRole('menuitemcheckbox', { name: 'Police dyslexique' }).click()
    await expect(page.locator('html')).toHaveClass(/a11y-dyslexic/)

    await page.reload()
    await page.waitForFunction(() => document.documentElement.classList.contains('a11y-dyslexic'))
  })

  test('le contraste élevé épargne les éléments .no-contrast', async ({ page }) => {
    await gotoReady(page, '/')
    await visible(page, page.getByRole('button', { name: accessibilityMenu })).click()
    await page.getByRole('menuitemcheckbox', { name: 'Contraste élevé' }).click()
    await expect(page.locator('html')).toHaveClass(/a11y-highContrast/)
    await expect(page.locator('.no-contrast').first()).toHaveCSS('filter', 'contrast(0.667)')
  })
})

test.describe('réduire les animations', () => {
  test.use({ reducedMotion: 'reduce' })

  test('les compteurs de l’accueil affichent directement leur valeur', async ({ page }) => {
    await gotoReady(page, '/')
    const counter = page
      .getByText('Année de création du club')
      .locator('xpath=preceding-sibling::span[1]')
    await counter.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    expect(await counter.textContent()).toBe('2016')
  })

  test('la vidéo de l’accueil ne se lance pas seule', async ({ page }) => {
    await gotoReady(page, '/')
    const toggle = page.getByRole('button', { name: 'Lire la vidéo' })
    test.skip((await toggle.count()) === 0, 'pas de vidéo : CDN_URL vide au build')
    await page.waitForTimeout(500)
    expect(await page.locator('video').evaluate((v: HTMLVideoElement) => v.paused)).toBe(true)
    await expect(toggle).toBeVisible()
  })

  test('le carrousel d’une activité ne défile pas tout seul', async ({ page }) => {
    // Photos du CDN remplacées par une image de 1 px (le CDN est coupé par les fixtures)
    const pixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64',
    )
    await page.route(/\/tandem\/tandem-\d+\.jpg/, (route) =>
      route.fulfill({ contentType: 'image/png', body: pixel }),
    )
    await gotoReady(page, '/activites/tandem')
    const container = page.locator('[aria-roledescription="carousel"] [data-slot="container"]')
    test.skip((await container.count()) === 0, 'pas de carrousel : CDN_URL vide au build')

    const position = () => container.evaluate((el) => getComputedStyle(el).transform)
    // Embla positionne les diapositives à l'initialisation : mesure une fois en place
    await page.waitForTimeout(1000)
    const before = await position()
    await page.waitForTimeout(4000)
    expect(await position()).toBe(before)
  })

  test('une pastille de catégorie amène directement à sa section, sous l’en-tête', async ({
    page,
  }) => {
    const docs = readYaml<{ categories: { name: string }[] }>('pages/documents.yml')
    const second = docs.categories[1]!.name
    await gotoReady(page, '/documents')
    await page.getByRole('button', { name: second }).click()
    // Sans attendre : avec « réduire les animations », le défilement est immédiat
    const { top, header } = await page
      .getByRole('heading', { level: 2, name: second })
      .evaluate((el) => ({
        top: el.closest('section')!.getBoundingClientRect().top,
        header: document.querySelector('header')!.getBoundingClientRect().bottom,
      }))
    expect(top).toBeGreaterThanOrEqual(header)
    expect(top).toBeLessThan(header + 64)
  })
})

test.describe('galerie', () => {
  const items = readYaml<{ items: { type: string }[] }>('pages/galerie.yml').items
  const cards = (page: import('@playwright/test').Page) =>
    page.locator('main a[target="_blank"]').filter({ has: page.locator('img') })

  test('les filtres ne gardent que les albums du type choisi', async ({ page }) => {
    await gotoReady(page, '/galerie')
    await expect(cards(page)).toHaveCount(items.length)

    const tandem = items.filter((item) => item.type === 'tandem').length
    await page.getByRole('button', { name: 'Tandem' }).click()
    await expect(cards(page)).toHaveCount(tandem)

    await page.getByRole('button', { name: 'Tout voir' }).click()
    await expect(cards(page)).toHaveCount(items.length)
  })
})

test.describe('FAQ et documents', () => {
  test('une question de la FAQ s’ouvre au clic', async ({ page }) => {
    const faq = readYaml<{ categories: { questions: { question: string }[] }[] }>('pages/faq.yml')
    const first = faq.categories[0]!.questions[0]!.question
    await gotoReady(page, '/faq')
    const trigger = page.getByRole('button', { name: first })
    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  test('la molette interrompt le défilement lancé par une pastille', async ({ page }) => {
    const docs = readYaml<{ categories: { name: string }[] }>('pages/documents.yml')
    const last = docs.categories.at(-1)!.name
    await gotoReady(page, '/documents')
    await page.getByRole('button', { name: last }).click()
    await page.waitForTimeout(250)
    // Vrai geste de molette (Chromium) : un mouse.wheel synthétique ne reproduit pas le cas
    const cdp = await page.context().newCDPSession(page)
    await cdp.send('Input.synthesizeScrollGesture', {
      x: 200,
      y: 400,
      yDistance: -100,
      gestureSourceType: 'mouse',
    })
    const stopped = await page.evaluate(() => window.scrollY)
    await page.waitForTimeout(1000)
    expect(await page.evaluate(() => window.scrollY)).toBe(stopped)
  })

  test('une pastille de catégorie fait défiler jusqu’à sa section', async ({ page }) => {
    const docs = readYaml<{ categories: { name: string }[] }>('pages/documents.yml')
    const last = docs.categories.at(-1)!.name
    await gotoReady(page, '/documents')
    await page.getByRole('button', { name: last }).click()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200)
  })
})

test.describe('activités', () => {
  test('les sections facultatives suivent le contenu', async ({ page }) => {
    await gotoReady(page, '/activites/tandem')
    await expect(page.getByRole('heading', { name: 'Comment ça se passe ?' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Prérequis' })).toBeVisible()

    // OA n'a pas de photos de carrousel (imageCount: 0)
    await gotoReady(page, '/activites/oa')
    await expect(page.locator('[aria-roledescription="carousel"]')).toHaveCount(0)
  })
})
