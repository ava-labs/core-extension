import { mergeRsbuildConfig } from '@rsbuild/core';
import { CopyRspackPlugin } from '@rspack/core';
import commonConfig from './rsbuild.next.common.ts';
import { transformManifestFiles } from '../../build-scripts/manifestHelpers.js';
import { getEnvVars } from '../../build-scripts/getEnvVars.ts';

export default mergeRsbuildConfig(commonConfig, {
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
                name: '[alpha] Core NextGen',
                shortName: '[alpha] Core NextGen',
                actionDefaultTitle: '[alpha] Core NextGen Browser Extension',
                oAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
              }),
              force: true,
            },
            { from: 'src/images/beta-logos', to: './images', force: true },
          ],
        }),
      ],
    },
  },
});
