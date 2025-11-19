import { defineConfig, devices } from '@playwright/test';
import * as path from 'node:path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const shardId = process.env.PLAYWRIGHT_SHARD || 'default';

const testRailOptions = {
  embedAnnotationsAsProperties: true,
  outputFile: `../test-results/junit-report-${shardId}.xml`,
};

export default defineConfig({
  globalSetup: require.resolve('./global-setup.ts'),
  testDir: '../tests',
  testMatch: '**/*.spec.ts',
  outputDir: '../test-results',
  timeout: 120000,
  expect: { timeout: 10000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [process.env.CI ? ['junit', testRailOptions] : ['html'], ['list']],

  // Shared settings for all projects
  use: {
    trace: 'on-first-retry',
    video: 'on-first-retry',
    headless: process.env.HEADLESS === 'true',
    bypassCSP: true,
    navigationTimeout: 30000,
    actionTimeout: 30000,
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    viewport: { width: 1920, height: 1080 },

    // Slow down operations (useful for debugging)
    // launchOptions: {
    //   slowMo: 100,
    // },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
        // Chrome-specific args for extension testing
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
          ],
        },
      },
    },
  ],
});
