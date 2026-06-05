import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';
import buildCommonConfig from './rsbuild.content-script.common';
import { getEnvVars } from '../../build-scripts/getEnvVars';

const skipSourceMap = process.env.NO_SOURCE_MAPS === 'true';
// Local dev never regenerates the LavaMoat policy — keep app edits from
// silently widening permissions. Use `yarn build` (or CI) to refresh it.
const commonConfig = buildCommonConfig({ generateLavaMoatPolicy: false });

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
