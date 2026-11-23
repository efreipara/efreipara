import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Page } from '@playwright/test'
import { format, resolveConfig } from 'prettier'
import { goalName, isOutbound, linkLabel, pageGoalName } from '../../app/utils/goals'
import type { SeoData } from '../../app/utils/seo'
import { redirectRoutes } from '../../content.routes'
import { readYaml, root } from '../content/helpers'
import { expect, gotoReady, test } from './fixtures'
import { pages } from './routes'

// Noms des événements Plausible de chaque lien qui sort du site, comparés à docs/plausible/goals.txt.
// UPDATE_GOALS=1 (bun run goals) réécrit la liste et le script de la console.
const listFile = join(root, 'docs/plausible/goals.txt')
const scriptFile = join(root, 'docs/plausible/goals-console.js')

const seo = readYaml<SeoData>('global/seo.yml')
const labels = readYaml<{
  goalZones: { banner: string }
  events: { register: string }
  error: { home: string }
}>('global/labels.yml')
const notFound = '/page-inexistante'
const redirectPaths = redirectRoutes()

// Même lecture du DOM que plugins/link-goals.client.ts, le nommage passe par utils/goals.ts
const collect = async (page: Page) => {
  const { origin, pathname, title, links } = await page.evaluate(() => ({
    origin: location.origin,
    pathname: location.pathname,
    title: document.title,
    links: [...document.querySelectorAll('a[href]')].map((link) => ({
      href: link.getAttribute('href'),
      own: link.getAttribute('data-goal-title'),
      marked: link.querySelector('[data-goal-title]')?.textContent ?? null,
      aria: link.getAttribute('aria-label'),
      text: link.textContent,
      zone: link.closest<HTMLElement>('[data-goal-zone]')?.dataset.goalZone,
    })),
  }))
  return links
    .filter((link) => isOutbound(link.href, origin, redirectPaths))
    .map((link) => {
      const label = linkLabel({
        getAttribute: (name) => (name === 'aria-label' ? link.aria : link.own),
        querySelector: () => (link.marked === null ? null : { textContent: link.marked }),
        textContent: link.text,
      })
      return goalName(link.zone ?? pageGoalName(pathname, title, seo), label)
    })
}

const consoleScript = (
  names: string[],
) => `// Généré par \`bun run goals\` (docs/plausible/README.md) : ne pas modifier à la main.
// À coller dans la console d'une page du site : envoie chaque nom une fois, à 150 ms d'intervalle.
/* global plausible */
;(() => {
  const names = ${JSON.stringify(names)}
  names.forEach((name, i) => {
    setTimeout(() => plausible(name, { callback: (r) => console.log(i + 1, name, r) }), i * 150)
  })
})()
`

test.describe('goals Plausible', () => {
  test('chaque lien du site a son nom dans docs/plausible/goals.txt', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'desktop, puis menu mobile par redimensionnement')
    test.setTimeout(120_000)
    const names = new Set<string | null>()
    const add = async () => (await collect(page)).forEach((name) => names.add(name))

    for (const path of [...pages, notFound]) {
      await gotoReady(page, path)
      // La page d'erreur s'affiche après l'hydratation
      if (path === notFound) await page.getByRole('link', { name: labels.error.home }).waitFor()
      const activities = page.getByRole('banner').getByRole('link', { name: 'Nos activités' })
      if (await activities.count()) {
        await activities.hover()
        await page.locator('header nav a[href="/activites/tandem"]').waitFor()
      }
      await add()
      // Cartes d'événements (accueil, pages d'activité), présentes seulement avant un événement
      if (path === '/' || path.startsWith('/activites/'))
        names.add(goalName(pageGoalName(path, await page.title(), seo), labels.events.register))
    }

    await page.setViewportSize({ width: 390, height: 844 })
    await gotoReady(page, '/')
    await page.getByRole('button', { name: 'Ouvrir le menu' }).first().click()
    await page.getByRole('dialog').waitFor()
    await add()

    // La bannière n'est affichée qu'avant un événement : nom tiré du contenu (formulaire externe)
    names.add(goalName(labels.goalZones.banner, labels.events.register))

    expect(names.has(null), 'lien sans nom').toBe(false)
    const sorted = [...names].map(String).sort((a, b) => a.localeCompare(b, 'fr'))

    if (process.env.UPDATE_GOALS) {
      writeFileSync(listFile, `${sorted.join('\n')}\n`)
      const options = { ...(await resolveConfig(scriptFile)), filepath: scriptFile }
      writeFileSync(scriptFile, await format(consoleScript(sorted), options))
    }
    const listed = readFileSync(listFile, 'utf8').trim().split('\n')
    expect(listed, 'liste périmée : bun run generate puis bun run goals').toEqual(sorted)
  })
})
