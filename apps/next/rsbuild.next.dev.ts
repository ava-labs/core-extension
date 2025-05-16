import { mergeRsbuildConfig } from '@rsbuild/core';
import { CopyRspackPlugin } from '@rspack/core';
import commonConfig from './rsbuild.next.common';

import { transformManifestFiles } from '../../build-scripts/manifestHelpers.js';
import { getEnvVars } from '../../build-scripts/getEnvVars.js';

export default mergeRsbuildConfig(commonConfig, {
  mode: 'development',
  source: {
    define: getEnvVars('dev'),
  },
  output: {
    sourceMap: {
      js: 'hidden-source-map',
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
                name: 'Core NextGen',
                shortName: 'Core NextGen',
                actionDefaultTitle: 'Core NextGen Browser Extension',
                oAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
                publicKey: '', // TODO: add public key
              }),
            },
          ],
        }),
      ],
    },
  },
});
