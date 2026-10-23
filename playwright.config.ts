import { existsSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

const port = 4173
const brave = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'

// PLAYWRIGHT_BROWSER_PATH, sinon Brave s'il est installé, sinon le Chromium de Playwright
const executablePath =
  process.env.PLAYWRIGHT_BROWSER_PATH || (existsSync(brave) ? brave : undefined)

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${port}`,
    locale: 'fr-FR',
    launchOptions: { executablePath },
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  // Le site doit avoir été généré avant (bun run generate)
  webServer: {
    command: `PORT=${port} bun tests/e2e/serve.ts`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
  },
})
