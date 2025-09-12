import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';
import { CopyRspackPlugin } from '@rspack/core';
import commonConfig from './rsbuild.legacy.common';
import { transformManifestFiles } from '../../build-scripts/manifestHelpers.js';
import { getEnvVars } from '../../build-scripts/getEnvVars';

export default defineConfig((...args) =>
  mergeRsbuildConfig(commonConfig(...args), {
    mode: 'production',
    output: {
      sourceMap: {
        js: 'hidden-source-map',
      },
    },
    source: {
      define: getEnvVars('production'),
    },
    tools: {
      rspack: {
        plugins: [
          new CopyRspackPlugin({
            patterns: [
              {
                context: 'manifest/',
                from: '**/*.json',
                to: './',
                force: true,
                transform: transformManifestFiles({
                  name: 'Core Wallet: Crypto Made Easy',
                  shortName: 'Core',
                  actionDefaultTitle: 'Core Wallet: Crypto Made Easy',
                  oAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
                  publicKey: process.env.EXTENSION_PUBLIC_KEY,
                }),
              },
            ],
          }),
        ],
      },
    },
  }),
);
