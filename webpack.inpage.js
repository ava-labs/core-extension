const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { DefinePlugin } = require('webpack');

const fs = require('fs');

const svgPath = path.resolve(__dirname, 'src/images/favicon.svg');
const svgCoreIcon = fs.readFileSync(svgPath, 'base64');

const devEvmProviderConfig = {
  EVM_PROVIDER_INFO_NAME: '"Core Dev"',
  EVM_PROVIDER_INFO_UUID: '"b11db586-a24d-4d95-81c1-62bb8e9da7b5"',
  EVM_PROVIDER_INFO_ICON: JSON.stringify(
    `data:image/svg+xml;base64,${svgCoreIcon}`
  ),
  EVM_PROVIDER_INFO_DESCRIPTION: '"Core Dev Browser Extension"',
  EVM_PROVIDER_INFO_RDNS: '"app.core.extension"',
};

const prodEvmProviderConfig = {
  EVM_PROVIDER_INFO_NAME: '"Core"',
  EVM_PROVIDER_INFO_UUID: '"eafb8ae4-8535-48df-b8c1-e69b999c367d"',
  EVM_PROVIDER_INFO_ICON: JSON.stringify(
    `data:image/svg+xml;base64,${svgCoreIcon}`
  ),
  EVM_PROVIDER_INFO_DESCRIPTION: '"Core | Crypto Wallet & NFT Extension"',
  EVM_PROVIDER_INFO_RDNS: '"app.core.extension"',
};

module.exports = (env, argv) => {
  const isDevBuild = argv.mode !== 'production';
  const evmProviderConfig = isDevBuild
    ? devEvmProviderConfig
    : prodEvmProviderConfig;
  return {
    mode: 'development',
    devtool: 'hidden-source-map',
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
              ],
              plugins: ['@babel/transform-runtime'],
            },
          },
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
        ...evmProviderConfig,
        // For non-dev builds, it's replaced by actual version number later in the release process
        CORE_EXTENSION_VERSION: isDevBuild ? '0.0.0' : 'CORE_EXTENSION_VERSION',
      }),
    ],
  };
};
