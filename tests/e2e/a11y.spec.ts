import AxeBuilder from '@axe-core/playwright'
import { knownViolations } from './a11y-known'
import { expect, gotoReady, test } from './fixtures'
import { pages } from './routes'

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`accessibilité (${colorScheme === 'light' ? 'clair' : 'sombre'})`, () => {
    test.use({ colorScheme })

    for (const path of pages) {
      test(`${path} : aucune nouvelle violation grave`, async ({ page }) => {
        await gotoReady(page, path)
        // Laisse finir les animations d'entrée, qui faussent les contrastes
        await page.waitForTimeout(800)

        const { violations } = await new AxeBuilder({ page }).analyze()
        const unexpected = violations
          // heading-order est « moderate » mais vérifié aussi : titres dans l'ordre sur chaque page
          .filter(
            (v) => v.impact === 'serious' || v.impact === 'critical' || v.id === 'heading-order',
          )
          .filter((v) => !knownViolations[v.id]?.includes(path))
          .map(
            (v) => `${v.id} (${v.impact}) : ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
          )

        expect(unexpected).toEqual([])
      })
    }

    test('/ en décembre : la neige n’ajoute aucune violation', async ({ page }) => {
      await page.clock.install({ time: new Date('2026-12-10T12:00:00') })
      await gotoReady(page, '/')
      await expect(page.locator('.seasonal-decor .drop').first()).toBeAttached()
      await page.waitForTimeout(800)
      const { violations } = await new AxeBuilder({ page }).include('.seasonal-decor').analyze()
      expect(violations.map((v) => v.id)).toEqual([])
    })
  })
}
