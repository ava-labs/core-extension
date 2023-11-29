const { merge } = require('webpack-merge');
const prod = require('./webpack.prod.js');
const CopyPlugin = require('copy-webpack-plugin');
require('dotenv').config({ path: './.env.production' });

module.exports = merge(prod, {
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          context: 'manifest/',
          from: '**/*.json',
          to: '../',
          transform: (content) =>
            content
              .toString()
              .replace('__NAME__', 'Core Beta DEVELOPMENT BUILD')
              .replace('__SHORT_NAME__', 'Core Beta')
              .replace(
                '__DEFAULT_TITLE__',
                'Core Beta Browser Extension DEVELOPMENT BUILD'
              )
              .replace(
                '__OAUTH_CLIENT_ID__',
                process.env.GOOGLE_OAUTH_CLIENT_ID
              )
              .replace('"key": "__EXTENSION_PUBLIC_KEY__",', ''),
          force: true,
        },
        { from: 'src/images/beta-logos', to: '../images', force: true },
      ],
    }),
  ],
});
