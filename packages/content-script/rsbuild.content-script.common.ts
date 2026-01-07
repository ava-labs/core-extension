import path from 'path';
import { defineConfig } from '@rsbuild/core';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';

export default defineConfig(() => {
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
      },
    },
  };
});
