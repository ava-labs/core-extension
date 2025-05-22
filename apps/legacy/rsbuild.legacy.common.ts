import { defineConfig } from '@rsbuild/core';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import path from 'path';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { CopyRspackPlugin } from '@rspack/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  environments: {
    web: {
      html: {
        mountId: 'popup',
        template: 'src/index.html',
        title: 'Core',
      },
      source: {
        decorators: {
          version: 'legacy',
        },
        entry: {
          popup: path.join(__dirname, 'src/popup/index.tsx'),
          home: path.join(__dirname, 'src/popup/index.tsx'),
          fullscreen: path.join(__dirname, 'src/popup/index.tsx'),
          confirm: path.join(__dirname, 'src/popup/index.tsx'),
        },
      },
      output: {
        target: 'web',
      },
    },
  },
  output: {
    cleanDistPath: {
      enable: true,
      keep: [
        // preserving the files from package builds
        /dist\/cs\/.*/,
        /dist\/inpage\/.*/,
        /dist\/offscreen\/.*/,
        /dist\/sw\/.*/,
      ],
    },
    inlineStyles: true,
    injectStyles: true,
    filename: {
      js: '[name].js', // this is the default, but just to make sure
    },
    distPath: {
      root: path.join(__dirname, '../../dist'),
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
      react: path.resolve('../../node_modules/react'),
      'react-dom': path.resolve('../../node_modules/react-dom'),
      path: require.resolve('path-browserify'),
      '@hpke/core': path.resolve(
        '../../node_modules/@hpke/core/esm/core/mod.js',
      ),
      '@cubist-labs/cubesigner-sdk': path.resolve(
        '../../node_modules/@cubist-labs/cubesigner-sdk/dist/cjs/src/index.js',
      ),
      // Joi by default goes to browser-specific version which does not include the list of TLDS (which we need for email validation)
      joi: path.resolve('../../node_modules/joi/lib/index.js'),
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
    rspack: (_, { appendPlugins, appendRules }) => {
      appendPlugins(
        new CopyRspackPlugin({
          patterns: [
            { from: 'src/images', to: 'images' },
            { from: 'src/localization/locales', to: 'locales', force: true },
          ],
        }),
      );
      if (process.env.RSDOCTOR === 'true') {
        appendPlugins(new RsdoctorRspackPlugin({}));
      }

      appendRules({
        test: /\.wasm$/,
        // Tells WebPack that this module should be included as
        // base64-encoded binary file and not as code
        loader: 'base64-loader',
        // Disables WebPack's opinion where WebAssembly should be,
        // makes it think that it's not WebAssembly
        //
        // Error: WebAssembly module is included in initial chunk.
        type: 'javascript/auto',
      });
    },
  },
});
