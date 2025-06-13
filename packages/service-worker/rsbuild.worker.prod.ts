import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';
import commonConfig from './rsbuild.worker.common';
import { getEnvVars } from '../../build-scripts/getEnvVars';

const skipSourceMap = process.env.NO_SOURCE_MAPS === 'true';

export default defineConfig((...args) =>
  mergeRsbuildConfig(commonConfig(...args), {
    mode: 'production',
    output: {
      sourceMap: skipSourceMap ? false : { js: 'hidden-source-map' },
    },
    source: {
      define: getEnvVars('production'),
    },
  }),
);
