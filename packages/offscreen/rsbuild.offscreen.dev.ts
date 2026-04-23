import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';
import commonConfig from './rsbuild.offscreen.common';
import { getEnvVars } from '../../build-scripts/getEnvVars';

const skipSourceMap = process.env.NO_SOURCE_MAPS === 'true';

export default defineConfig((...args) =>
  mergeRsbuildConfig(commonConfig(...args), {
    source: {
      define: getEnvVars('dev'),
    },
    output: {
      sourceMap: skipSourceMap ? false : { js: 'inline-source-map' },
    },
  }),
);
