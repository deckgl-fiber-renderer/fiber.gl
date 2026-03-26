import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Global mock cleanup - eliminates test pollution bugs
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    watch: false,

    // Test environment for React components
    environment: 'jsdom',

    // Coverage thresholds (80%+ for dom)
    coverage: {
      enabled: true,
      exclude: ['**/__tests__/**', '**/dist/**', '**/node_modules/**'],
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
