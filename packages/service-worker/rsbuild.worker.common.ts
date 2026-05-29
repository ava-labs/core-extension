import LavaMoatRspackPlugin from '@core/lavamoat-rspack';
import { defineConfig } from '@rsbuild/core';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import path from 'path';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginReact } from '@rsbuild/plugin-react';

export interface CommonConfigOptions {
  /**
   * When true, LavaMoat regenerates `policy.json` during the build. Enabled
   * for shippable builds (prod) so CI can flag policy drift; disabled for
   * local dev so editing app code can't silently widen permissions.
   */
  generateLavaMoatPolicy: boolean;
}

export default ({ generateLavaMoatPolicy }: CommonConfigOptions) =>
  defineConfig(() => {
    const distSubdirectory = 'dist';

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
          '@hpke/core': '../../node_modules/@hpke/core/esm/mod.js',
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

          appendPlugins(
            new LavaMoatRspackPlugin({
              // Driven per build target: prod regenerates so PR CI can fail
              // on policy drift, dev loads the checked-in policy so local
              // edits can't silently widen permissions without a code review.
              generatePolicy: generateLavaMoatPolicy,
              policyLocation: path.join(__dirname, 'lavamoat/rspack'),
              // Service worker has no HTML host page to inject a <script
              // src="./lockdown"> tag into. Prepend SES lockdown directly to
              // the entry bundle so it executes before any wrapped module.
              inlineLockdown: /backgroundPage\.js$/,
              // Packages whose code statically appears to mutate JS
              // primordials (e.g. Object.keys, Function.prototype), which
              // SES lockdown freezes. The build will fail if an unlisted
              // package triggers this warning.
              //
              // See `apps/next/rsbuild.next.common.ts` for the criteria
              // applied when deciding whether to add a package here.
              //
              // The canonical names differ from the ones in `apps/next`
              // because @lavamoat/aa traverses the dep tree from this
              // workspace, so e.g. `@sentry/browser` is a direct dep here
              // (`@sentry/browser>...`) rather than reached via `@core/ui`.
              knownIncompatiblePackages: [
                // Wraps Function.prototype.toString in a try/catch; already
                // handles frozen intrinsics gracefully (catches and skips
                // the patch).
                '@sentry/browser>@sentry/core',
                // Assigns Symbol.iterator only when it's missing; always
                // present in Chromium so the `||` short-circuits and never
                // writes.
                'fireblocks-sdk>@notabene/pii-sdk>did-jwt',
                // Polyfills Object.keys for Safari 5.0 arguments bug; the
                // guard (`if (!keysWorksWithArguments)`) is always false in
                // Chromium 80+.
                'i18next-scanner>vinyl-fs>object.assign>object-keys',
                // Polyfills Array.isArray and ArrayBuffer.isView behind
                // `JS_SHA3_NO_NODE_JS` flag checks; both exist natively in
                // Chromium.
                'web3>web3-utils>ethereum-bloom-filters>js-sha3',
              ],
            }),
          );
        },
      },
    };
  });
