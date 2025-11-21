import { defineConfig } from '@playwright/test';
import { baseConfig } from './base.config';

export default defineConfig({
  ...baseConfig,

  // Local-specific overrides
  use: {
    ...baseConfig.use,
    // Local testing can be slower for debugging
    actionTimeout: 45000,
    navigationTimeout: 45000,
  },

  retries: 1,
  timeout: 180000,
});
