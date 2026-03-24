import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Global mock cleanup - eliminates test pollution bugs
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,

    // Test environment
    environment: "node",

    // Include .test-d.ts files for type tests
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)", "**/*.test-d.ts"],

    // No coverage thresholds needed for type tests
    // Type tests use expectTypeOf and run at compile-time
  },
});
