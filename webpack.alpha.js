const { merge } = require('webpack-merge');
const prod = require('./webpack.prod.js');
const CopyPlugin = require('copy-webpack-plugin');

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
              ),
          force: true,
        },
        { from: 'src/images/beta-logos', to: '../images', force: true },
      ],
    }),
  ],
});
