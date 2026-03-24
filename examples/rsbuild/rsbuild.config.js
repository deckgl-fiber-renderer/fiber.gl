import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  html: {
    template: './index.html',
  },

  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/main.tsx',
    },
  },
});
