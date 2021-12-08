const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    backgroundPage: path.join(__dirname, 'src/backgroundPage.ts'),
    popup: path.join(__dirname, 'src/popup/index.tsx'),
    contentscript: path.join(__dirname, 'src/contentscript.ts'),
  },
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js',
    chunkFilename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-typescript',
              '@babel/preset-env',
              '@babel/preset-react',
            ],
            plugins: ['@babel/transform-runtime'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@src': path.resolve(__dirname, 'src/'),
      // prevent having 2 concurrent copies of react when linking a lib with react as dev dependency
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      'styled-components': path.resolve('./node_modules/styled-components'),
      '@types/bn.js': path.resolve('./node_modules/@types/bn.js'),
      // use alias for bn.js to prevent bundling it >23 times per output file (saves ~1.5MB)
      'bn.js': path.resolve('./node_modules/bn.js'),
    },
    symlinks: false,
  },
  plugins: [
    new NodePolyfillPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'src/index.html', to: '../popup.html' },
        { from: 'src/index.html', to: '../home.html' },
        { from: 'src/index.html', to: '../confirm.html' },
        { from: 'src/manifest.json', to: '../manifest.json' },
        { from: 'src/images', to: '../images' },
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],
};
