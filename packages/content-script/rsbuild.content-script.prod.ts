import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';
import buildCommonConfig from './rsbuild.content-script.common';
import { getEnvVars } from '../../build-scripts/getEnvVars';

// Production builds regenerate the policy so PR CI can detect drift between
// the checked-in policy.json and what the actual bundle would need.
const commonConfig = buildCommonConfig({ generateLavaMoatPolicy: true });

export default defineConfig((...args) =>
  mergeRsbuildConfig(commonConfig(...args), {
    mode: 'production',
    output: {
      sourceMap: {
        js: 'hidden-source-map',
      },
    },
    source: {
      define: getEnvVars('production'),
    },
  }),
);
