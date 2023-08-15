const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { ProvidePlugin } = require('webpack');

module.exports = {
  entry: {
    backgroundPage: path.join(__dirname, 'src/background/index.ts'),
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
              [
                '@babel/preset-env',
                {
                  targets: {
                    browsers: ['last 2 Chrome versions'],
                  },
                  modules: false,
                },
              ],
              '@babel/preset-react',
            ],
            plugins: [
              'babel-plugin-transform-typescript-metadata',
              '@babel/transform-runtime',
              ['@babel/plugin-proposal-decorators', { legacy: true }],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|eot|ttf)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'assets',
          },
        },
      },
      {
        test: /\.wasm$/,
        // Tells WebPack that this module should be included as
        // base64-encoded binary file and not as code
        loader: 'base64-loader',
        // Disables WebPack's opinion where WebAssembly should be,
        // makes it think that it's not WebAssembly
        //
        // Error: WebAssembly module is included in initial chunk.
        type: 'javascript/auto',
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
      // use alias for bn.js to prevent bundling it >23 times per output file (saves ~1.5MB)
      'bn.js': path.resolve('./node_modules/bn.js'),
    },
    // We're using different node.js modules in our code,
    // this prevents WebPack from failing on them or embedding
    // polyfills for them into the bundle.
    //
    // Error: Module not found: Error: Can't resolve 'fs'
    fallback: {
      path: false,
      fs: false,
      Buffer: false,
      process: false,
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
        { from: 'src/images', to: '../images' },
        { from: 'src/localization/locales', to: '../locales', force: true },
      ],
      options: {
        concurrency: 100,
      },
    }),
    new ProvidePlugin({
      React: 'react',
    }),
  ],
};
