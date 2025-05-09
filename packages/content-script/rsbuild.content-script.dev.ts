import { mergeRsbuildConfig } from '@rsbuild/core';
import commonConfig from './rsbuild.content-script.common';
import { getEnvVars } from '../../build-scripts/getEnvVars';

export default mergeRsbuildConfig(commonConfig, {
  mode: 'development',
  source: {
    define: getEnvVars('dev'),
  },
});
