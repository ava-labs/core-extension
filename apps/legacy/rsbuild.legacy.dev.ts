import { mergeRsbuildConfig } from '@rsbuild/core';
import { CopyRspackPlugin } from '@rspack/core';
import commonConfig from './rsbuild.legacy.common';

import { transformManifestFiles } from '../../build-scripts/manifestHelpers.js';
import { getEnvVars } from '../../build-scripts/getEnvVars';

export default mergeRsbuildConfig(commonConfig, {
  mode: 'development',
  source: {
    define: getEnvVars('dev'),
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
