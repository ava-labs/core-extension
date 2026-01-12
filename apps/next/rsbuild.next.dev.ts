import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';
import { CopyRspackPlugin } from '@rspack/core';
import commonConfig from './rsbuild.next.common';

import { transformManifestFiles } from '../../build-scripts/manifestHelpers.js';
import { getEnvVars } from '../../build-scripts/getEnvVars.js';

export default defineConfig((...args) =>
  mergeRsbuildConfig(commonConfig(...args), {
    mode: 'development',
    source: {
      define: getEnvVars('dev'),
    },
    output: {
      sourceMap: {
        js: 'inline-source-map',
      },
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
                  name: '[dev] Core NextGen',
                  shortName: '[dev] Core NextGen',
                  actionDefaultTitle: '[dev] Core NextGen Browser Extension',
                  oAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
                  publicKey: process.env.EXTENSION_PUBLIC_KEY,
                }),
              },
              { from: 'src/images/dev-logos', to: './images', force: true },
            ],
          }),
        ],
      },
    },
  }),
);
