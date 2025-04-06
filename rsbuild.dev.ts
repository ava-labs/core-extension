import 'dotenv/config.js';
import { mergeRsbuildConfig, loadEnv } from '@rsbuild/core';
import { CopyRspackPlugin } from '@rspack/core';
import commonConfig from './rsbuild.common';
// import Dotenv from 'dotenv-webpack';
import { transformManifestFiles } from './build-scripts/manifestHelpers.js';
const { parsed } = loadEnv();

export default mergeRsbuildConfig(commonConfig, {
  mode: 'development',
  output: {
    sourceMap: {
      js: 'inline-source-map',
    },
  },
  source: {
    define: {
      'process.env.NODE_ENV': JSON.stringify('development'), // webpack DefinePlugin
      ...parsed,
    },
  },
  tools: {
    rspack: {
      plugins: [
        // new Dotenv({
        //   ignoreStub: true,
        //   safe: true, // load '.env.example' to verify the '.env' variables are all set
        //   allowEmptyValues: true,
        // }),
        new CopyRspackPlugin({
          patterns: [
            {
              context: 'manifest/',
              from: '**/*.json',
              to: './',
              force: true,
              transform: transformManifestFiles({
                name: 'Core Dev',
                shortName: 'Core Dev',
                actionDefaultTitle: 'Core Dev Browser Extension',
                oAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
                publicKey: process.env.EXTENSION_PUBLIC_KEY,
              }),
            },
          ],
        }),
      ],
    },
  },
});
