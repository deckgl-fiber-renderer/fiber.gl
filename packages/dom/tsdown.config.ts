import pluginBabel from '@rolldown/plugin-babel';
import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,
  dts: true,
  entry: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.{d,stories,test,test-d,bench}.{ts,tsx}',
    '!**/__fixture__',
    '!**/__fixtures__',
    '!**/__tests__',
  ],
  exports: true,
  format: 'esm',
  minify: false,
  platform: 'neutral',
  plugins: [
    pluginBabel({
      parserOpts: {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      },
      plugins: ['babel-plugin-react-compiler'],
    }),
  ],
  sourcemap: true,
  treeshake: true,
  unbundle: true,
});
