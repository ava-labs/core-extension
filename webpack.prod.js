const { DefinePlugin } = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
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
          transform: (content) =>
            content
              .toString()
              .replace('__NAME__', 'Core | Crypto Wallet & NFT Extension')
              .replace('__SHORT_NAME__', 'Core')
              .replace(
                '__DEFAULT_TITLE__',
                'Core | Crypto Wallet & NFT Extension'
              )
              .replace(
                '__OAUTH_CLIENT_ID__',
                process.env.GOOGLE_OAUTH_CLIENT_ID
              )
              .replace('"key": "__EXTENSION_PUBLIC_KEY__",', ''),
          force: true,
        },
      ],
    }),
  ],
});
