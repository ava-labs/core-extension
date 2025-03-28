const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { DefinePlugin } = require('webpack');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const {
  transformManifestFiles,
} = require('./build-scripts/manifestHelpers.js');

require('dotenv').config({ path: './.env' });

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new Dotenv({
      ignoreStub: true,
      safe: true, // load '.env.example' to verify the '.env' variables are all set
      allowEmptyValues: true,
    }),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          context: 'manifest/',
          from: '**/*.json',
          to: '../',
          transform: transformManifestFiles({
            name: 'Core Dev',
            shortName: 'Core Dev',
            actionDefaultTitle: 'Core Dev Browser Extension',
            oAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
            publicKey: process.env.EXTENSION_PUBLIC_KEY,
          }),
          force: true,
        },
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    symlinks: false,
  },
});
