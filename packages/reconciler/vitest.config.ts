import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Global mock cleanup - eliminates test pollution bugs
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,

    // Test environment
    environment: "node",

    // Coverage thresholds (80%+ for reconciler)
    coverage: {
      exclude: [
        "**/__tests__/**",
        "**/__fixtures__/**",
        "**/dist/**",
        "**/node_modules/**",
      ],
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },

    // Setup file
    setupFiles: ["./src/__tests__/setup.ts"],
  },
});
