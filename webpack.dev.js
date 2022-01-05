const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { DefinePlugin } = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@avalabs/avalanche-wallet-sdk': path.resolve(
        './node_modules/@avalabs/wallet-react-components/node_modules/@avalabs/avalanche-wallet-sdk'
      ),
    },
    fallback: {
      '@avalabs/avalanche-wallet-sdk': path.resolve(
        `./node_modules/@avalabs/avalanche-wallet-sdk`
      ),
    },
    symlinks: false,
  },
});
