import { mergeRsbuildConfig } from '@rsbuild/core';
import commonConfig from './rsbuild.worker.common';
import { getEnvVars } from '../../build-scripts/getEnvVars';

export default mergeRsbuildConfig(commonConfig, {
  mode: 'production',
  output: {
    sourceMap: false,
  },
  source: {
    define: getEnvVars('production'),
  },
  // tools: {
  //   rspack: {
  //     plugins: [
  //       new CopyRspackPlugin({
  //         patterns: [
  //           {
  //             context: 'manifest/',
  //             from: '**/*.json',
  //             to: './',
  //             force: true,
  //             transform: transformManifestFiles({
  //               name: 'Core | Crypto Wallet & NFT Extension',
  //               shortName: 'Core',
  //               actionDefaultTitle: 'Core | Crypto Wallet & NFT Extension',
  //               oAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  //             }),
  //           },
  //         ],
  //       }),
  //     ],
  //   },
  // },
});
