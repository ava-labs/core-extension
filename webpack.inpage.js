const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { DefinePlugin } = require('webpack');

const fs = require('fs');

const svgPath = path.resolve(__dirname, 'src/images/favicon.svg');
const svgCoreIcon = fs.readFileSync(svgPath, 'base64');

const devEvmProviderConfig = {
  name: JSON.stringify('core_dev'),
  uuid: JSON.stringify('b11db586-a24d-4d95-81c1-62bb8e9da7b5'),
  icon: JSON.stringify(`data:image/svg+xml;base64,${svgCoreIcon}`),
  description: JSON.stringify('Core Dev Browser Extension'),
};

const prodEvmProviderConfig = {
  name: JSON.stringify('core'),
  uuid: JSON.stringify('eafb8ae4-8535-48df-b8c1-e69b999c367d'),
  icon: JSON.stringify(`data:image/svg+xml;base64,${svgCoreIcon}`),
  description: JSON.stringify('Core | Crypto Wallet & NFT Extension'),
};

module.exports = (env, argv) => {
  const evmProviderConfig =
    argv.mode === 'production' ? prodEvmProviderConfig : devEvmProviderConfig;
  return {
    mode: 'development',
    entry: {
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
      alias: {},
      symlinks: false,
    },
    plugins: [
      new NodePolyfillPlugin(),
      new DefinePlugin({
        EVM_PROVIDER_INFO: { ...evmProviderConfig },
      }),
    ],
  };
};
