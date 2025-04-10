import { defineConfig } from '@rsbuild/core';
import path from 'path';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { CopyRspackPlugin } from '@rspack/core';
import { pluginReact } from '@rsbuild/plugin-react';

const entriesToSkipHtmlGeneration = {
  backgroundPage: path.join(__dirname, 'src/background/index.ts'),
  contentscript: path.join(__dirname, 'src/contentscript.ts'),
};

export default defineConfig({
  environments: {
    web: {
      source: {
        decorators: {
          version: 'legacy',
        },
        entry: {
          popup: path.join(__dirname, 'src/popup/index.tsx'),
          offscreen: path.join(__dirname, 'src/offscreen.ts'),
        },
      },
      output: {
        target: 'web',
      },
    },
    'web-worker': {
      source: {
        entry: {
          backgroundPage: path.join(__dirname, 'src/background/index.ts'),
          contentscript: path.join(__dirname, 'src/contentscript.ts'),
        },
      },
      output: {
        target: 'web-worker',
      },
    },
  },
  output: {
    cleanDistPath: {
      keep: [
        // preserving the files from the inpage build
        /dist\/js\/inpage.js/,
        /dist\/js\/vendors-node_modules_avalabs_core-chains-sdk\w*/,
      ],
    },
    sourceMap: {
      js: 'hidden-source-map',
    },
    inlineStyles: true,
    injectStyles: true,
    filename: {
      js: '[name].js', // this is the default, but just to make sure
    },
    distPath: {
      js: 'js',
      jsAsync: 'js',
      image: 'images',
      font: 'js/assets',
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
  plugins: [
    pluginNodePolyfill(),
    pluginReact({
      swcReactOptions: {
        refresh: false,
      },
    }),
  ],
  tools: {
    rspack: {
      plugins: [
        new CopyRspackPlugin({
          patterns: [
            { from: 'src/index.html', to: 'home.html' },
            { from: 'src/index.html', to: 'confirm.html', force: true },
            { from: 'src/index.html', to: 'fullscreen.html', force: true },
            { from: 'src/images', to: 'images' },
            { from: 'src/localization/locales', to: 'locales', force: true },
          ],
        }),
      ],
    },
  },
});
