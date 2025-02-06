const { merge } = require('webpack-merge');
const prod = require('./webpack.prod.js');
const CopyPlugin = require('copy-webpack-plugin');
const {
  transformManifestFiles,
} = require('./build-scripts/manifestHelpers.js');
require('dotenv').config({ path: './.env.production' });

module.exports = merge(prod, {
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          context: 'manifest/',
          from: '**/*.json',
          to: '../',
          transform: transformManifestFiles({
            name: 'Core Beta DEVELOPMENT BUILD',
            shortName: 'Core Beta',
            actionDefaultTitle: 'Core Beta Browser Extension DEVELOPMENT BUILD',
            oAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
            originTrialsPromptAPIKey: process.env.ORIGIN_TRIALS_PROMPT_API_KEY,
          }),
          force: true,
        },
        { from: 'src/images/beta-logos', to: '../images', force: true },
      ],
    }),
  ],
});
