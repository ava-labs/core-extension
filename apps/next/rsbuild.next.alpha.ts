import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';
import { CopyRspackPlugin } from '@rspack/core';
import commonConfig from './rsbuild.next.common.ts';
import { transformManifestFiles } from '../../build-scripts/manifestHelpers.js';
import { getEnvVars } from '../../build-scripts/getEnvVars.ts';

export default defineConfig((...args) =>
  mergeRsbuildConfig(commonConfig(...args), {
    mode: 'production',
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
                transform: transformManifestFiles({
                  name: '[alpha] Core Wallet: Crypto Made Easy NextGen DEVELOPMENT BUILD',
                  shortName: '[alpha] Core NextGen',
                  actionDefaultTitle:
                    '[alpha] Core Wallet: Crypto Made Easy NextGen DEVELOPMENT BUILD',
                  oAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
                  publicKey: process.env.NEXT_GEN_EXTENSION_PUBLIC_KEY,
                }),
                force: true,
              },
              { from: 'src/images/beta-logos', to: './images', force: true },
            ],
          }),
        ],
      },
    },
  }),
);
