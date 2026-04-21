import { defineConfig } from "oxlint";

import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";
import vitest from "ultracite/oxlint/vitest";

export default defineConfig({
  extends: [core, react, vitest],
  ignorePatterns: ["**/dist/**", "**/coverage/**", "CHANGELOG.md"],
  rules: {
    "func-style": "off",
    "no-inline-comments": "warn",
    "prefer-to-be-falsy": "off",
    "sort-keys": "warn",
  },
});
