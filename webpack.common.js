const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    backgroundPage: path.join(__dirname, 'src/backgroundPage.ts'),
    popup: path.join(__dirname, 'src/popup/index.tsx'),
    contentscript: path.join(__dirname, 'src/contentscript.ts'),
    inpage: path.join(__dirname, 'src/inpage.js'),
  },
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@src': path.resolve(__dirname, 'src/'),
    },
    symlinks: false,
  },
  plugins: [
    new NodePolyfillPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'src/index.html', to: '../popup.html' },
        { from: 'src/index.html', to: '../home.html' },
        { from: 'src/manifest.json', to: '../manifest.json' },
        { from: 'src/images', to: '../images' },
        { from: '*.woff2', to: '../', context: "node_modules/@avalabs/react-components/lib" },
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],
};
