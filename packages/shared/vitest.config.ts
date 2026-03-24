import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Global mock cleanup - eliminates test pollution bugs
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,

    // Test environment
    environment: 'node',

    // Coverage thresholds (80%+ for shared)
    coverage: {
      exclude: [
        '**/__tests__/**',
        '**/dist/**',
        '**/node_modules/**',
        '**/logger.ts', // Excluded per design doc
      ],
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
