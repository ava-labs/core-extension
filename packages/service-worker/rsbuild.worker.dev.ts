import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';
import commonConfig from './rsbuild.worker.common';
import { getEnvVars } from '../../build-scripts/getEnvVars';

export default defineConfig((...args) =>
  mergeRsbuildConfig(commonConfig(...args), {
    mode: 'development',
    source: {
      define: getEnvVars('dev'),
    },
    output: {
      sourceMap: {
        js: 'inline-source-map',
      },
    },
  }),
);
