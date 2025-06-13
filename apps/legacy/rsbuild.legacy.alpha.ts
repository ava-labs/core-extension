import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';
import { CopyRspackPlugin } from '@rspack/core';
import commonConfig from './rsbuild.legacy.common.ts';
import { transformManifestFiles } from '../../build-scripts/manifestHelpers.js';
import { getEnvVars } from '../../build-scripts/getEnvVars.ts';

const skipSourceMap = process.env.NO_SOURCE_MAPS === 'true';

export default defineConfig((...args) =>
  mergeRsbuildConfig(commonConfig(...args), {
    mode: 'production',
    output: {
      sourceMap: skipSourceMap ? false : { js: 'hidden-source-map' },
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
                transform: transformManifestFiles({
                  name: 'Core Beta DEVELOPMENT BUILD',
                  shortName: 'Core Beta',
                  actionDefaultTitle:
                    'Core Beta Browser Extension DEVELOPMENT BUILD',
                  oAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
                  publicKey: process.env.EXTENSION_PUBLIC_KEY,
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
