import { defineConfig } from '@playwright/test';
import { baseConfig } from './config/base.config';

export default defineConfig({
  ...baseConfig,
});
