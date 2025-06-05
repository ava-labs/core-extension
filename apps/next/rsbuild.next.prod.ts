import { mergeRsbuildConfig } from '@rsbuild/core';
import { CopyRspackPlugin } from '@rspack/core';
import commonConfig from './rsbuild.next.common';
import { transformManifestFiles } from '../../build-scripts/manifestHelpers.js';
import { getEnvVars } from '../../build-scripts/getEnvVars.js';

export default mergeRsbuildConfig(commonConfig, {
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
              }),
            },
          ],
        }),
      ],
    },
  },
});
