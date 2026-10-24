import { readYaml } from '../content/helpers'
import { expect, test } from './fixtures'
import { redirectRoutes } from './routes'

const club = readYaml<{ socials: { key: string; url: string }[] }>('global/club.yml')
const rejoindre = readYaml<{ options: { slug: string; link: string }[] }>('pages/rejoindre.yml')

// Cible de chaque redirection : le réseau de même clé, ou le formulaire de l'option
const targetOf = (path: string) => {
  const slug = path.slice(1)
  return (
    club.socials.find((social) => social.key === slug)?.url ??
    rejoindre.options.find((option) => option.slug === slug)?.link
  )
}
const targets = Object.fromEntries(redirectRoutes.map((path) => [path, targetOf(path)]))

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

test('/about, page retirée, mène à l’accueil', async ({ page }) => {
  await page.goto('/about')
  await expect(page).toHaveURL(/\/$/)
})
