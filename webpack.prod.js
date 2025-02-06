const { DefinePlugin } = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const {
  transformManifestFiles,
} = require('./build-scripts/manifestHelpers.js');
require('dotenv').config({ path: './.env.production' });

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new Dotenv({
      path: '.env.production',
      ignoreStub: true,
      safe: false, // the '.env' variables are set in the build workflow
    }),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          context: 'manifest/',
          from: '**/*.json',
          to: '../',
          transform: transformManifestFiles({
            name: 'Core | Crypto Wallet & NFT Extension',
            shortName: 'Core',
            actionDefaultTitle: 'Core | Crypto Wallet & NFT Extension',
            oAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
            originTrialsPromptAPIKey: process.env.ORIGIN_TRIALS_PROMPT_API_KEY,
          }),
          force: true,
        },
      ],
    }),
  ],
});
