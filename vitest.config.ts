import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.{ts,tsx}'],
    // Playwright specs live in e2e/ and run via `npm run test:e2e`, not vitest.
    exclude: ['e2e/**', 'node_modules/**', '.next/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
})
