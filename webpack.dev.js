const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { DefinePlugin } = require('webpack');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
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
          transform: (content) => {
            return content
              .toString()
              .replace('__NAME__', 'Core Dev')
              .replace('__SHORT_NAME__', 'Core Dev')
              .replace('__DEFAULT_TITLE__', 'Core Dev Browser Extension')
              .replace(
                '__OAUTH_CLIENT_ID__',
                process.env.GOOGLE_OAUTH_CLIENT_ID
              )
              .replace(
                '__EXTENSION_PUBLIC_KEY__',
                process.env.EXTENSION_PUBLIC_KEY
              );
          },
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
