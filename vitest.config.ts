import { defineConfig } from 'vitest/config'

// Tests sans Nuxt : logique pure (app/utils) et contenu (content/)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts', 'tests/content/**/*.test.ts'],
  },
})
