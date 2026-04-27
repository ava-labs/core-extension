import LavaMoatRspackPlugin from '@core/lavamoat-rspack';
import { defineConfig } from '@rsbuild/core';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginReact } from '@rsbuild/plugin-react';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
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
        copy: {
          patterns: [
            { from: 'src/images', to: 'images' },
            { from: 'src/localization/locales', to: 'locales', force: true },
          ],
        },
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

      appendPlugins(
        new LavaMoatRspackPlugin({
          generatePolicy: true,
          policyLocation: path.join(__dirname, 'lavamoat/rspack'),
          // Packages whose code statically appears to mutate JS primordials
          // (e.g. Object.keys, Function.prototype), which SES lockdown freezes.
          // The build will fail if an unlisted package triggers this warning.
          //
          // Before adding a package here, open the flagged file and check:
          //  1. Is the mutation wrapped in try/catch? (harmless — it throws and
          //     the catch handles it, like Sentry does)
          //  2. Is it behind a feature-detect guard that's always true in
          //     Chromium 80+? (harmless — the polyfill branch never executes)
          //  3. Does it unconditionally overwrite a primordial with no guard?
          //     (harmful — the write will throw a TypeError at runtime because
          //     SES freezes all intrinsics, crashing the package and anything
          //     that depends on it. Use a policy override or exclude instead.)
          knownIncompatiblePackages: [
            // Wraps Function.prototype.toString in a try/catch; already handles
            // frozen intrinsics gracefully (catches and skips the patch).
            '@core/ui>@sentry/browser>@sentry/core',
            // Polyfills Object.keys for Safari 5.0 arguments bug; the guard
            // (`if (!keysWorksWithArguments)`) is always false in Chromium 80+.
            'i18next-scanner>vinyl-fs>object.assign>object-keys',
            // Assigns Symbol.iterator only when it's missing; always present in
            // Chromium so the `||` short-circuits and never writes.
            '@core/service-worker>fireblocks-sdk>@notabene/pii-sdk>did-jwt',
            // Polyfills Array.isArray and ArrayBuffer.isView behind
            // `JS_SHA3_NO_NODE_JS` flag checks; both exist natively in Chromium.
            '@avalabs/fusion-sdk>@layerzerolabs/lz-v2-utilities>@ethersproject/keccak256>js-sha3',
          ],
        }),
      );
    },
  },
}));
