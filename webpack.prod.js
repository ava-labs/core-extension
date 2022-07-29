const { DefinePlugin } = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');

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
          from: 'src/manifest.json',
          to: '../manifest.json',
          transform: (content) =>
            content
              .toString()
              .replace('__NAME__', 'Core')
              .replace('__SHORT_NAME__', 'Core')
              .replace('__DEFAULT_TITLE__', 'Core Browser Extension'),
          force: true,
        },
      ],
    }),
  ],
});
