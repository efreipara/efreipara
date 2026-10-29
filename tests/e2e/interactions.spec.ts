import type { Page } from '@playwright/test'
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

// Le CDN est coupé : play() échouerait toujours. On le remplace pour compter les lectures.
declare global {
  interface Window {
    __videoPlays: number
  }
}
const stubVideo = (page: Page) =>
  page.addInitScript(() => {
    window.__videoPlays = 0
    HTMLMediaElement.prototype.play = function () {
      window.__videoPlays++
      this.dispatchEvent(new Event('play'))
      return Promise.resolve()
    }
    HTMLMediaElement.prototype.pause = function () {
      this.dispatchEvent(new Event('pause'))
    }
  })

test.describe('vidéo de l’accueil', () => {
  test('se lance au chargement et se met en pause par son bouton', async ({ page }) => {
    await stubVideo(page)
    await gotoReady(page, '/')
    const pause = page.getByRole('button', { name: 'Mettre la vidéo en pause' })
    test.skip((await page.locator('video source').count()) === 0, 'pas de vidéo : CDN_URL vide')
    await expect(pause).toBeVisible()
    expect(await page.evaluate(() => window.__videoPlays)).toBe(1)

    await pause.click()
    await expect(page.getByRole('button', { name: 'Lire la vidéo' })).toBeVisible()
  })
})

// Lien « Durées de conservation » du sommaire de /rgpd (liste de grand écran ou menu de téléphone)
const tocLink = (page: Page) =>
  page
    .locator('nav a[data-slot="link"]', { hasText: 'Durées de conservation' })
    .locator('visible=true')
const sectionTop = (page: Page) =>
  page.getByRole('heading', { level: 2, name: /Durées de conservation/ }).evaluate((el) => ({
    top: el.getBoundingClientRect().top,
    header: document.querySelector('header')!.getBoundingClientRect().bottom,
  }))

test.describe('pages légales', () => {
  test('le sommaire fait défiler jusqu’à la section, sans « # » dans l’adresse', async ({
    page,
    isMobile,
  }) => {
    await gotoReady(page, '/rgpd')
    if (isMobile) await page.getByRole('button', { name: 'Sur cette page' }).click()
    await tocLink(page).click()
    await expect
      .poll(async () => {
        const { top, header } = await sectionTop(page)
        return top >= header && top < header + 120
      })
      .toBe(true)
    expect(new URL(page.url()).hash).toBe('')
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

  test('le sommaire d’une page légale amène directement à la section', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'menu replié avant le défilement sur téléphone')
    await gotoReady(page, '/rgpd')
    await tocLink(page).click()
    // Sans attendre : avec « réduire les animations », le défilement est immédiat
    const { top, header } = await sectionTop(page)
    expect(top).toBeGreaterThanOrEqual(header)
    expect(top).toBeLessThan(header + 120)
  })

  test('la vidéo de l’accueil ne se lance pas seule', async ({ page }) => {
    await stubVideo(page)
    await gotoReady(page, '/')
    test.skip((await page.locator('video source').count()) === 0, 'pas de vidéo : CDN_URL vide')
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.__videoPlays)).toBe(0)
    await expect(page.getByRole('button', { name: 'Lire la vidéo' })).toBeVisible()
  })

  test('le carrousel d’une activité ne défile pas tout seul', async ({ page }) => {
    // Photos du CDN remplacées par une image de 1 px (le CDN est coupé par les fixtures)
    const pixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64',
    )
    await page.route(/\/activites\/carrousel\/tandem-\d+-\d+\.webp/, (route) =>
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

  test('le compteur suit le filtre et le focus reste sur le filtre', async ({ page }) => {
    const { count } = readYaml<{ count: { one: string; other: string } }>('pages/galerie.yml')
    const label = (n: number) => `${n} ${n > 1 ? count.other : count.one}`
    await gotoReady(page, '/galerie')
    await expect(page.getByText(label(items.length), { exact: true })).toBeVisible()

    const tandemCount = items.filter((item) => item.type === 'tandem').length
    const tandem = page.getByRole('button', { name: 'Tandem' })
    await tandem.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByText(label(tandemCount), { exact: true })).toBeVisible()
    await expect(tandem).toHaveAttribute('aria-pressed', 'true')
    await expect(tandem).toBeFocused()
    // Noms de transition retirés ensuite : la bascule clair / sombre garde son cercle
    await expect(page.locator('html')).not.toHaveClass(/gallery-transition/)
    await expect(cards(page).first()).not.toHaveAttribute('style', /view-transition-name/)
  })
})

test.describe('FAQ et documents', () => {
  test('chaque document indique son site de destination', async ({ page }) => {
    const { defaults } = readYaml<{ defaults: { siteName: string } }>('global/seo.yml')
    await gotoReady(page, '/documents')
    await expect(page.getByRole('link', { name: /Règlement intérieur/ })).toContainText(
      defaults.siteName,
    )
    await expect(page.getByRole('link', { name: /Contre-indications médicales/ })).toContainText(
      'ffp.asso.fr',
    )
  })

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

test.describe('boutons', () => {
  test('un bouton étiré centre son contenu (Discord de « Nous rejoindre »)', async ({ page }) => {
    const { alert } = readYaml<{ alert: { actionLabel: string } }>('pages/rejoindre.yml')
    await gotoReady(page, '/rejoindre')
    const offset = await page.getByRole('link', { name: alert.actionLabel }).evaluate((el) => {
      const kids = [...el.children].map((child) => child.getBoundingClientRect())
      const box = el.getBoundingClientRect()
      const middle =
        (Math.min(...kids.map((r) => r.left)) + Math.max(...kids.map((r) => r.right))) / 2
      return Math.abs(middle - (box.left + box.width / 2))
    })
    expect(offset).toBeLessThanOrEqual(1)
  })
})
