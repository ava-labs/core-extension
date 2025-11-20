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

/**
 * Worker configuration:
 * - Local: Uses all available CPU cores (undefined = 100% parallelization)
 * - CI: Configurable via WORKERS env var, defaults to 4 for optimal performance
 *
 * The CI runner has 16 cores with 4 CPUs allocated per container.
 * Using 4 workers allows parallel test execution within each shard.
 */
const getWorkers = () => {
  if (!process.env.CI) {
    // Local: use all available cores for maximum speed
    return undefined; // Playwright will use 50% of CPU cores
  }

  // CI: use configured workers or default to 4
  const workers = parseInt(process.env.WORKERS || '4', 10);
  console.log(`Running with ${workers} parallel workers in CI`);
  return workers;
};

/**
 * Fully parallel mode allows tests within a single file to run in parallel.
 * Disabled in CI to ensure more stable test execution with extension.
 */
const fullyParallel = !process.env.CI;

export default defineConfig({
  globalSetup: require.resolve('./global-setup.ts'),
  testDir: '../tests',
  testMatch: '**/*.spec.ts',
  outputDir: '../test-results',
  timeout: 120000,
  expect: { timeout: 10000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: getWorkers(),
  fullyParallel: fullyParallel,
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
