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
              // `reflect-metadata` polyfills `Reflect.decorate`, `.metadata`,
              // `.getMetadata` etc. by calling `Object.defineProperty` on
              // the real `Reflect`. tsyringe (our DI container) and every
              // `@injectable` / `@inject` decorator at module top-level
              // depends on those being installed before any service code
              // runs. If we let `import 'reflect-metadata'` execute as a
              // normal wrapped module it lands AFTER `hardenIntrinsics()`
              // freezes `Reflect`, so the very first `defineProperty` call
              // throws `TypeError: Cannot define property decorate, object
              // is not extensible` and the SW bundle never finishes
              // booting (manifests as extension not booting up at all).
              //
              // Registering it as a static shim instead inlines its source
              // into the `LOCKDOWN_SHIMS` array, which the runtime runs
              // between `repairIntrinsics()` and `hardenIntrinsics()` —
              // `Reflect` is still extensible at that point, the polyfill
              // installs cleanly, and the subsequent harden step freezes
              // `Reflect` *with* the new properties present.
              //
              // `require.resolve` runs in this package's context so we get
              // service-worker's hoisted copy (not lavamoat-rspack's own
              // node_modules), matching exactly the copy `init.ts` would
              // have imported.
              //
              // NOTE: Important to note here, this renders `reflect-metadata`
              // as a possible supply-chain attack vector, but with it being
              // pinned to version 0.1.13, with no real updates in ~4 years
              // and no other dependencies, this is considered low risk.
              staticShims_experimental: [require.resolve('reflect-metadata')],
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
