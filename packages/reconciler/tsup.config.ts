import { esbuildPluginFilePathExtensions } from "esbuild-plugin-file-path-extensions";
import { defineConfig } from "tsup";

export default defineConfig({
  bundle: true,
  clean: true,
  dts: true,
  entry: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.{d,stories,test,test-d,bench}.{ts,tsx}",
    "!**/__fixture__",
  ],
  esbuildPlugins: [
    esbuildPluginFilePathExtensions({
      esm: true,
      esmExtension: "js",
    }),
  ],
  format: "esm",
  sourcemap: true,
  splitting: true,
  treeshake: true,
});
