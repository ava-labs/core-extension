const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { DefinePlugin } = require('webpack');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');

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
          transform: (content) =>
            content
              .toString()
              .replace('__NAME__', 'Core Dev')
              .replace('__SHORT_NAME__', 'Core Dev')
              .replace('__DEFAULT_TITLE__', 'Core Dev Browser Extension'),
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
