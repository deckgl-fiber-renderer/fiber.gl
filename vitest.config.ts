import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Global mock cleanup - eliminates test pollution bugs
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,

    // Test environment
    environment: "node",

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      // Package-specific thresholds are defined in each package's vitest.config.ts
      // This root config serves as a fallback
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
      exclude: [
        "**/__tests__/**",
        "**/__fixtures__/**",
        "**/dist/**",
        "**/node_modules/**",
        "**/examples/**",
        "**/docs/**",
      ],
    },
  },
});
