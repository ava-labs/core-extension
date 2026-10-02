import LavaMoatRspackPlugin from '@core/lavamoat-rspack';
import { defineConfig } from '@rsbuild/core';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import path from 'path';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';

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
        web: {
          html: {
            template: 'src/offscreen.html',
          },
          source: {
            decorators: {
              version: 'legacy',
            },
            entry: {
              offscreen: path.join(__dirname, 'src/offscreen.ts'),
            },
          },
          output: {
            target: 'web',
          },
        },
      },
      output: {
        cleanDistPath: true,
        assetPrefix: './',
        filename: {
          js: '[name].js', // this is the default, but just to make sure
        },
        distPath: {
          root: path.join(__dirname, '../..', distSubdirectory, 'offscreen'),
          js: 'js',
          jsAsync: 'js',
        },
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        fallback: {
          path: false,
          fs: false,
          Buffer: false,
          process: false,
        },
      },
      plugins: [pluginNodePolyfill()],
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
              // Walk the dependency tree from the monorepo root rather than
              // this package. Offscreen's package.json only declares
              // `@core/*` workspace deps, so @lavamoat/aa would otherwise
              // miss every transitive npm dep that `@core/common` re-exports
              // (e.g. fireblocks-sdk → @notabene/pii-sdk → did-jwt) and emit
              // them as `external:` placeholder names that aren't useful.
              rootDir: path.join(__dirname, '../..'),
              // The offscreen document has its own HTML host, but we still
              // prepend SES into the entry bundle rather than emitting a
              // separate `lockdown` asset: keeps the document to a single
              // request and matches how service-worker / content-script are
              // wired in this repo.
              inlineLockdown: /offscreen\.js$/,
              // Same primordial-mutation pattern as in service-worker /
              // content-script: both packages reach the offscreen entry via
              // `@core/common`'s `unifiedTransfer/` re-exports (fusion-sdk
              // → … → js-sha3, fireblocks-sdk → … → did-jwt). Walking from
              // the monorepo root flattens them to top-level npm names.
              knownIncompatiblePackages: ['did-jwt', 'js-sha3'],
            }),
          );
        },
      },
    };
  });
