import { mergeRsbuildConfig } from '@rsbuild/core';
import commonConfig from './rsbuild.offscreen.common';
import { getEnvVars } from '../../build-scripts/getEnvVars';

export default mergeRsbuildConfig(commonConfig, {
  mode: 'production',
  output: {
    sourceMap: false,
  },
  source: {
    define: getEnvVars('production'),
  },
});
