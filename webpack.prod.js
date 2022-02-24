const { DefinePlugin } = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');

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
  ],
});
