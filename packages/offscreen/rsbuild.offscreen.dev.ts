import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';
import commonConfig from './rsbuild.offscreen.common';
import { getEnvVars } from '../../build-scripts/getEnvVars';

export default defineConfig((...args) =>
  mergeRsbuildConfig(commonConfig(...args), {
    mode: 'development',
    source: {
      define: getEnvVars('dev'),
    },
  }),
);
