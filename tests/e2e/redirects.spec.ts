import { readText, readYaml } from '../content/helpers'
import { expect, test } from './fixtures'

const appConfig = readText('app/app.config.ts')
const socialUrl = (name: string) =>
  appConfig.match(new RegExp(`${name}: \\{[^}]*?url: '([^']+)'`))?.[1]

const rejoindre = readYaml<{ options: { slug: string; link: string }[] }>('pages/rejoindre.yml')

const targets: Record<string, string | undefined> = {
  '/discord': socialUrl('discord'),
  '/instagram': socialUrl('instagram'),
  ...Object.fromEntries(rejoindre.options.map((o) => [`/${o.slug}`, o.link])),
}

test.describe('redirections', () => {
  for (const [path, target] of Object.entries(targets)) {
    test(`${path} envoie vers ${target}`, async ({ page }) => {
      expect(target).toBeTruthy()
      // La cible est coupée par la fixture : on vérifie seulement que le navigateur y part
      const request = page.waitForRequest((req) => req.url().startsWith(target!))
      await page.goto(path)
      await request
    })
  }
})
