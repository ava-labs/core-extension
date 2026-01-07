import { defineConfig } from '@rsbuild/core';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginReact } from '@rsbuild/plugin-react';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { CopyRspackPlugin } from '@rspack/core';
import path from 'path';

export default defineConfig(() => ({
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
          sidePanel: path.join(__dirname, 'src/popup/index.tsx'),
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
        /dist-next\/cs\/.*/,
        /dist-next\/inpage\/.*/,
        /dist-next\/offscreen\/.*/,
        /dist-next\/sw\/.*/,
      ],
    },
    inlineStyles: true,
    injectStyles: true,
    filename: {
      js: '[name].js', // this is the default, but just to make sure
    },
    distPath: {
      root: path.join(__dirname, '../../dist-next'),
      js: 'js',
      jsAsync: 'js',
      image: 'images',
      font: 'js/assets',
      // assets: 'assets',
    },
  },
  // performance: {
  //   chunkSplit: {
  //     forceSplitting: {
  //       mui: /node_modules[\\/]@mui/,
  //       emotion: /node_modules[\\/]@emotion/,
  //     },
  //   },
  // },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      path: require.resolve('path-browserify'),
    },
    fallback: {
      path: false,
      fs: false,
      Buffer: false,
      process: false,
    },
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
}));
