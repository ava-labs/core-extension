import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';
import { CopyRspackPlugin } from '@rspack/core';
import commonConfig from './rsbuild.next.common';
import { transformManifestFiles } from '../../build-scripts/manifestHelpers.js';
import { getEnvVars } from '../../build-scripts/getEnvVars.js';

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
                  name: 'Core | Crypto Wallet & NFT Extension',
                  shortName: 'Core',
                  actionDefaultTitle: 'Core | Crypto Wallet & NFT Extension',
                  oAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
                  // TODO: add public key once ready
                  // publicKey: process.env.EXTENSION_PUBLIC_KEY,
                }),
              },
            ],
          }),
        ],
      },
    },
  }),
);
