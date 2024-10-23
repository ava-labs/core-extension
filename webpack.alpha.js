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
            name: 'Core ETNA BUILD',
            shortName: 'Core Beta',
            actionDefaultTitle: 'Core Beta Browser Extension ETNA BUILD',
            oAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
            publicKey: process.env.EXTENSION_PUBLIC_KEY,
          }),
          force: true,
        },
        { from: 'src/images/beta-logos', to: '../images', force: true },
      ],
    }),
  ],
});
