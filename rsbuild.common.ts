import { defineConfig } from '@rsbuild/core';
import path from 'path';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { CopyRspackPlugin } from '@rspack/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  source: {
    entry: {
      backgroundPage: path.join(__dirname, 'src/background/index.ts'),
      popup: path.join(__dirname, 'src/popup/index.tsx'),
      contentscript: path.join(__dirname, 'src/contentscript.ts'),
      offscreen: path.join(__dirname, 'src/offscreen.ts'),
    },
  },
  output: {
    sourceMap: {
      js: 'hidden-source-map',
    },
    filename: {
      js: '[name].js', // this is the default, but just to make sure
    },
    distPath: {
      js: 'js',
      image: 'images',
      font: 'assets',
      // assets: 'assets',
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@src': path.resolve(__dirname, 'src/'),
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      // use alias for bn.js to prevent bundling it >23 times per output file (saves ~1.5MB)
      // 'bn.js': path.resolve('./node_modules/bn.js'),
      path: require.resolve('path-browserify'),
      '@hpke/core': path.resolve('./node_modules/@hpke/core/esm/core/mod.js'),
      '@cubist-labs/cubesigner-sdk': path.resolve(
        './node_modules/@cubist-labs/cubesigner-sdk/dist/cjs/src/index.js',
      ),
      // Joi by default goes to browser-specific version which does not include the list of TLDS (which we need for email validation)
      joi: path.resolve('./node_modules/joi/lib/index.js'),
    },
    dedupe: ['bn.js'],
  },
  plugins: [pluginNodePolyfill(), pluginReact()],
  tools: {
    rspack: {
      plugins: [
        new CopyRspackPlugin({
          patterns: [
            { from: 'src/index.html', to: '../popup.html' },
            { from: 'src/index.html', to: '../home.html' },
            { from: 'src/index.html', to: '../confirm.html' },
            { from: 'src/index.html', to: '../fullscreen.html' },
            { from: 'src/images', to: '../images' },
            { from: 'src/localization/locales', to: '../locales', force: true },
            { from: 'src/offscreen.html', to: '../offscreen.html' },
          ],
        }),
      ],
    },
  },
});
