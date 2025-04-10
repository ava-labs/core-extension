import path from 'node:path';
import fs from 'node:fs';
import { defineConfig } from '@rsbuild/core';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { DefinePlugin } from '@rspack/core';

const svgPath = path.resolve(__dirname, 'src/images/favicon.svg');
const svgCoreIcon = fs.readFileSync(svgPath, 'base64');
const devEvmProviderConfig = {
  EVM_PROVIDER_INFO_NAME: '"Core Dev"',
  EVM_PROVIDER_INFO_UUID: '"b11db586-a24d-4d95-81c1-62bb8e9da7b5"',
  EVM_PROVIDER_INFO_ICON: JSON.stringify(
    `data:image/svg+xml;base64,${svgCoreIcon}`,
  ),
  EVM_PROVIDER_INFO_DESCRIPTION: '"Core Dev Browser Extension"',
  EVM_PROVIDER_INFO_RDNS: '"app.core.extension"',
};

const prodEvmProviderConfig = {
  EVM_PROVIDER_INFO_NAME: '"Core"',
  EVM_PROVIDER_INFO_UUID: '"eafb8ae4-8535-48df-b8c1-e69b999c367d"',
  EVM_PROVIDER_INFO_ICON: JSON.stringify(
    `data:image/svg+xml;base64,${svgCoreIcon}`,
  ),
  EVM_PROVIDER_INFO_DESCRIPTION: '"Core | Crypto Wallet & NFT Extension"',
  EVM_PROVIDER_INFO_RDNS: '"app.core.extension"',
};

export default defineConfig(({ envMode }) => {
  const isDevBuild = envMode !== 'production';
  const evmProviderConfig = isDevBuild
    ? devEvmProviderConfig
    : prodEvmProviderConfig;

  return {
    mode: 'development',
    source: {
      entry: {
        inpage: path.join(__dirname, 'src/inpage.js'),
      },
    },
    output: {
      sourceMap: {
        js: 'hidden-source-map',
      },
      filename: {
        js: '[name].js', // this is the default, but just to make sure
      },
      distPath: {
        root: path.join(__dirname, 'dist'),
        js: 'js',
      },
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {},
    },
    plugins: [pluginNodePolyfill()],
    tools: {
      htmlPlugin: false,
      rspack: {
        plugins: [
          new DefinePlugin({
            ...evmProviderConfig,
            // For non-dev builds, it's replaced by actual version number later in the release process
            CORE_EXTENSION_VERSION: isDevBuild
              ? '"0.0.0"'
              : '"CORE_EXTENSION_VERSION"',
          }),
        ],
      },
    },
  };
});
