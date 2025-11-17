import { defineConfig } from '@playwright/test';
import * as path from 'node:path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  globalSetup: require.resolve('./config/global-setup.ts'),
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  outputDir: './test-results',
  timeout: 120000,
  expect: { timeout: 10000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [process.env.CI ? ['junit', { outputFile: './test-results/junit-report.xml' }] : ['html'], ['list']],

  // Shared settings for all projects
  use: {
    trace: 'on-first-retry',
    video: 'on-first-retry',
    headless: process.env.HEADLESS === 'true',
    bypassCSP: true,
    navigationTimeout: 45000,
    actionTimeout: 45000,
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    viewport: { width: 1920, height: 1080 },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        channel: 'chromium',
      },
    },
  ],
});
