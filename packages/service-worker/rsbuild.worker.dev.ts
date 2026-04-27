import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';
import commonConfig from './rsbuild.worker.common';
import { getEnvVars } from '../../build-scripts/getEnvVars';

const skipSourceMap = process.env.NO_SOURCE_MAPS === 'true';

export default defineConfig((...args) =>
  mergeRsbuildConfig(commonConfig(...args), {
    mode: 'development',
    source: {
      define: getEnvVars('dev'),
    },
    output: {
      sourceMap: skipSourceMap ? false : { js: 'inline-source-map' },
    },
  }),
);
