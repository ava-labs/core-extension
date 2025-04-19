import prod from './rsbuild.prod';
import { mergeRsbuildConfig } from '@rsbuild/core';
import { CopyRspackPlugin } from '@rspack/core';
import { transformManifestFiles } from './build-scripts/manifestHelpers.js';

export default mergeRsbuildConfig(prod, {
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
                name: 'Core Beta DEVELOPMENT BUILD',
                shortName: 'Core Beta',
                actionDefaultTitle:
                  'Core Beta Browser Extension DEVELOPMENT BUILD',
                oAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
              }),
            },
            { from: 'src/images/beta-logos', to: 'images', force: true },
          ],
        }),
      ],
    },
  },
});
