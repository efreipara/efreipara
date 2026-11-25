import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Page } from '@playwright/test'
import { format, resolveConfig } from 'prettier'
import {
  defaultLocaleGoalName,
  goalLinkKey,
  goalName,
  isOutbound,
  linkLabel,
  pageGoalName,
  type GoalNames,
} from '../../app/utils/goals'
import { delocalizePath } from '../../app/utils/locales'
import type { SeoData } from '../../app/utils/seo'
import { allRedirectRoutes } from '../../content.routes'
import { readYaml, root } from '../content/helpers'
import { expect, gotoReady, test } from './fixtures'
import { defaultPages, localePages } from './routes'

// Noms des événements Plausible de chaque lien qui sort du site, comparés à docs/plausible/goals.txt.
// UPDATE_GOALS=1 (bun run goals) réécrit la liste et le script de la console.
const listFile = join(root, 'docs/plausible/goals.txt')
const scriptFile = join(root, 'docs/plausible/goals-console.js')
// Noms relevés sur les pages françaises, repris par le plugin sur les pages d'une autre langue
const namesFile = join(root, 'app/utils/goal-names.json')

const seo = readYaml<SeoData>('global/seo.yml')
const labels = readYaml<{
  goalZones: { banner: string }
  events: { register: string }
  error: { home: string }
}>('global/labels.yml')
const notFound = '/page-inexistante'
const redirectPaths = allRedirectRoutes()
const pathOf = (pathname: string) => pathname.replace(/(.)\/$/, '$1')

// Même lecture du DOM que plugins/link-goals.client.ts, le nommage passe par utils/goals.ts
const collect = async (page: Page) => {
  const { origin, pathname, title, links } = await page.evaluate(() => ({
    origin: location.origin,
    pathname: location.pathname,
    title: document.title,
    links: [...document.querySelectorAll('a[href]')].map((link) => ({
      href: link.getAttribute('href'),
      own: link.getAttribute('data-goal-title'),
      key: link.getAttribute('data-goal-key'),
      marked: link.querySelector('[data-goal-title]')?.textContent ?? null,
      aria: link.getAttribute('aria-label'),
      text: link.textContent,
      zone: link.closest<HTMLElement>('[data-goal-zone]')?.dataset.goalZone,
    })),
  }))
  const path = pathOf(pathname)
  const pageName = pageGoalName(pathname, title, seo)
  const seen = new Map<string, number>()
  return {
    path,
    pageName,
    links: links
      .filter((link) => isOutbound(link.href, origin, redirectPaths))
      .map((link) => {
        // Rang parmi les liens de même adresse dans la même zone, comme le plugin
        const group = `${link.zone ?? ''}|${link.href}`
        const rank = seen.get(group) ?? 0
        seen.set(group, rank + 1)
        const label = linkLabel({
          getAttribute: (name) => (name === 'aria-label' ? link.aria : link.own),
          querySelector: () => (link.marked === null ? null : { textContent: link.marked }),
          textContent: link.text,
        })
        const scope = link.zone ?? pageName
        return { ...link, href: link.href!, rank, scope, name: goalName(scope, label) }
      }),
  }
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
  // Les pages anglaises se vérifient avec goal-names.json, écrit par le premier test
  test.describe.configure({ mode: 'serial' })

  test('chaque lien du site a son nom dans docs/plausible/goals.txt', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'desktop, puis menu mobile par redimensionnement')
    test.setTimeout(120_000)
    const names = new Set<string | null>()
    const goalNames: GoalNames = {
      scopes: {},
      links: {},
      labels: { register: labels.events.register },
    }
    const conflicts: string[] = []
    const add = async () => {
      const { path, pageName, links } = await collect(page)
      if (pageName) goalNames.scopes[path] = pageName
      for (const link of links) {
        names.add(link.name)
        if (!link.name) continue
        const key = goalLinkKey(link.scope, link.href, link.rank)
        if (goalNames.links[key] && goalNames.links[key] !== link.name)
          conflicts.push(`${key} : ${goalNames.links[key]} / ${link.name}`)
        goalNames.links[key] = link.name
      }
    }

    for (const path of [...defaultPages, notFound]) {
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

    expect(conflicts, 'un même lien porte deux noms sur une page').toEqual([])
    expect(names.has(null), 'lien sans nom').toBe(false)
    const sorted = [...names].map(String).sort((a, b) => a.localeCompare(b, 'fr'))

    const sortKeys = (record: Record<string, string>) =>
      Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b, 'fr')))
    const namesJson = await format(
      JSON.stringify({
        scopes: sortKeys(goalNames.scopes),
        links: sortKeys(goalNames.links),
        labels: goalNames.labels,
      }),
      { ...(await resolveConfig(namesFile)), filepath: namesFile },
    )

    if (process.env.UPDATE_GOALS) {
      writeFileSync(listFile, `${sorted.join('\n')}\n`)
      const options = { ...(await resolveConfig(scriptFile)), filepath: scriptFile }
      writeFileSync(scriptFile, await format(consoleScript(sorted), options))
      writeFileSync(namesFile, namesJson)
    }
    const listed = readFileSync(listFile, 'utf8').trim().split('\n')
    expect(listed, 'liste périmée : bun run generate puis bun run goals').toEqual(sorted)
    expect(readFileSync(namesFile, 'utf8'), 'goal-names.json périmé : bun run goals').toBe(
      namesJson,
    )
  })

  test('les pages anglaises envoient les noms des pages françaises', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop, puis menu mobile par redimensionnement')
    test.setTimeout(120_000)
    const goalNames = JSON.parse(readFileSync(namesFile, 'utf8')) as GoalNames
    const listed = new Set(readFileSync(listFile, 'utf8').trim().split('\n'))
    const unknown: string[] = []
    const check = async () => {
      const { path, links } = await collect(page)
      for (const link of links) {
        const name = defaultLocaleGoalName(goalNames, {
          zone: link.zone,
          path: delocalizePath(path),
          href: link.href.startsWith('/') ? delocalizePath(link.href) : link.href,
          rank: link.rank,
          key: link.key,
        })
        if (!name || !listed.has(name)) unknown.push(`${path} › ${link.href} : ${name}`)
      }
    }

    for (const path of localePages('en')) {
      await gotoReady(page, path)
      await check()
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoReady(page, '/en')
    await page.getByRole('button', { name: 'Open the menu' }).first().click()
    await page.getByRole('dialog').waitFor()
    await check()

    expect(unknown).toEqual([])
  })
})
