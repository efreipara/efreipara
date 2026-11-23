import { lowerFirst, type EventItem } from '../../app/utils/event'
import { readYaml } from '../content/helpers'
import { expect, gotoReady, test } from './fixtures'

// Horloge du navigateur figée autour du premier événement daté de global/events.yml :
// le test ne dépend ni de la date du jour ni de celle du generate
const { items } = readYaml<{ items: EventItem[] }>('global/events.yml')
const event = items.find((item) => item.date)
const labels = readYaml<{ goalZones: { banner: string }; activity: { events: string } }>(
  'global/labels.yml',
)
const at = (offsetDays: number) => {
  const day = new Date(`${event?.date}T10:00:00`)
  day.setDate(day.getDate() + offsetDays)
  return day
}

test.describe('événements', () => {
  test.skip(!event, 'aucun événement daté dans global/events.yml')

  test("annoncé jusqu'au jour même : bannière, accueil, page de l'activité", async ({ page }) => {
    await page.clock.setFixedTime(at(0))
    await gotoReady(page, '/')
    const banner = page.locator(`[data-goal-zone="${labels.goalZones.banner}"]`)
    await expect(banner).toContainText(lowerFirst(event!.title))
    await expect(page.locator('#evenements')).toContainText(event!.title)

    await gotoReady(page, `/activites/${event!.type}`)
    const section = page.locator('section', {
      has: page.getByRole('heading', { name: labels.activity.events }),
    })
    await expect(section).toContainText(event!.title)
  })

  test('retiré le lendemain, même sans nouveau generate', async ({ page }) => {
    await page.clock.setFixedTime(at(1))
    // Cartes des sections d'événements seulement : un album peut porter le même titre
    const card = page
      .locator('section', {
        has: page.getByRole('heading', { name: labels.activity.events, exact: true }),
      })
      .getByRole('heading', { name: event!.title, exact: true })
    const banner = page.locator(`[data-goal-zone="${labels.goalZones.banner}"]`, {
      hasText: lowerFirst(event!.title),
    })
    for (const path of ['/', `/activites/${event!.type}`]) {
      await gotoReady(page, path)
      await expect(card).toHaveCount(0)
      await expect(banner).toHaveCount(0)
    }
  })
})
