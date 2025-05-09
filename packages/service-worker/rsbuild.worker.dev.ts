import { mergeRsbuildConfig } from '@rsbuild/core';
import commonConfig from './rsbuild.worker.common';
import { getEnvVars } from '../../build-scripts/getEnvVars';

export default mergeRsbuildConfig(commonConfig, {
  mode: 'development',
  source: {
    define: getEnvVars('dev'),
  },
  output: {
    sourceMap: {
      js: 'hidden-source-map',
    },
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
  //               name: 'Core Dev',
  //               shortName: 'Core Dev',
  //               actionDefaultTitle: 'Core Dev Browser Extension',
  //               oAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  //               publicKey: process.env.EXTENSION_PUBLIC_KEY,
  //             }),
  //           },
  //         ],
  //       }),
  //     ],
  //   },
  // },
});
