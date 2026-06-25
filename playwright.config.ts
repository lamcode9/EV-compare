import { defineConfig, devices } from '@playwright/test'

const PORT = 9000
const BASE_URL = `http://127.0.0.1:${PORT}`

/**
 * E2E config for battery.mom critical user flows.
 * Runs against the Next dev server (chromium only). The dev server is started
 * automatically and reused if one is already running on the port.
 *
 * Requires a reachable database (DATABASE_URL in .env) — the compare flow loads
 * vehicles from /api/vehicles, which is Prisma-backed.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
})
