import dotenv from 'dotenv';
import { mergeRsbuildConfig, loadEnv } from '@rsbuild/core';
import { CopyRspackPlugin } from '@rspack/core';
import commonConfig from './rsbuild.ui.common.js';

dotenv.config({ path: './.env.production' });

import { transformManifestFiles } from '../../build-scripts/manifestHelpers.js';
const { parsed } = loadEnv();

const processEnv = Object.entries(parsed).reduce<Record<string, string>>(
  (accumulator, [envVariable, value]) => ({
    ...accumulator,
    [`process.env.${envVariable}`]: JSON.stringify(value),
  }),
  {},
);

export default mergeRsbuildConfig(commonConfig, {
  mode: 'production',
  output: {
    sourceMap: {
      js: 'inline-source-map',
    },
  },
  source: {
    define: {
      ...processEnv,
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
