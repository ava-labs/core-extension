import { defineConfig } from '@rsbuild/core';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import path from 'path';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginReact } from '@rsbuild/plugin-react';
import { readCoreCliArgument } from '../../build-scripts/readCoreCliArgument.mjs';

export default defineConfig(() => {
  const gen = readCoreCliArgument('gen') || 'legacy';
  const distSubdirectory = gen === 'next' ? 'dist-next' : 'dist';

  return {
    environments: {
      'web-worker': {
        source: {
          decorators: {
            version: 'legacy',
          },
          entry: {
            backgroundPage: path.join(__dirname, 'src/init.ts'),
          },
        },
        output: {
          target: 'web-worker',
        },
      },
    },
    output: {
      cleanDistPath: true,
      inlineStyles: true,
      injectStyles: true,
      filename: {
        js: '[name].js', // this is the default, but just to make sure
      },
      distPath: {
        root: path.join(__dirname, '../..', distSubdirectory, 'sw'),
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
        path: require.resolve('path-browserify'),
        '@hpke/core': '../../node_modules/@hpke/core/esm/core/mod.js',
        // Joi by default goes to browser-specific version which does not include the list of TLDS (which we need for email validation)
        joi: require.resolve('joi/lib/index.js'),
      },
      dedupe: ['bn.js', 'ledger-bitcoin'],
      fallback: {
        path: false,
        fs: false,
        Buffer: false,
        process: false,
      },
    },
    plugins: [
      pluginNodePolyfill({
        overrides: {
          buffer: 'buffer',
        },
      }),
      pluginReact({
        swcReactOptions: {
          refresh: false,
        },
      }),
    ],
    tools: {
      rspack: (_, { appendPlugins, appendRules }) => {
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
  };
});
