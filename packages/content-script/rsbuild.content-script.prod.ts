import { mergeRsbuildConfig } from '@rsbuild/core';
import commonConfig from './rsbuild.content-script.common';
import { getEnvVars } from '../../build-scripts/getEnvVars';

export default mergeRsbuildConfig(commonConfig, {
  mode: 'production',
  output: {
    sourceMap: {
      js: 'inline-source-map',
    },
  },
  source: {
    define: getEnvVars('production'),
  },
});
