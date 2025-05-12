import { defineConfig } from '@rsbuild/core';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import path from 'path';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { readCoreCliArgument } from '../../build-scripts/readCoreCliArgument';

export default defineConfig(() => {
  const gen = readCoreCliArgument('gen') || 'legacy';
  const distSubdirectory = gen === 'next' ? 'dist-next' : 'dist';

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
      },
    },
  };
});
