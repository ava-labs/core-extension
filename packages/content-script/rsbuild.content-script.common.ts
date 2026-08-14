import LavaMoatRspackPlugin from '@core/lavamoat-rspack';
import path from 'path';
import { defineConfig } from '@rsbuild/core';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
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
        'web-worker': {
          source: {
            decorators: {
              version: 'legacy',
            },
            entry: {
              contentscript: path.join(__dirname, 'src/contentscript.ts'),
            },
          },
          output: {
            target: 'web-worker',
          },
        },
      },
      output: {
        cleanDistPath: true,
        filename: {
          js: '[name].js', // this is the default, but just to make sure
        },
        distPath: {
          root: path.join(__dirname, '../..', distSubdirectory, 'cs'),
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
              // this package. Content script's package.json only declares
              // `@core/*` workspace deps, so @lavamoat/aa would otherwise
              // miss every transitive npm dep that `@core/common` re-exports
              // (e.g. fireblocks-sdk → @notabene/pii-sdk → did-jwt) and emit
              // them as `external:` placeholder names that aren't useful.
              rootDir: path.join(__dirname, '../..'),
              // Content script is injected by the browser as raw JS — there
              // is no host HTML to drop a <script src="./lockdown"> tag
              // into. Prepend SES lockdown to the entry bundle so it
              // executes before any wrapped module in the isolated world.
              inlineLockdown: /contentscript\.js$/,
              // Same primordial-mutation pattern as in service-worker /
              // apps/next: both packages reach the content script via
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
