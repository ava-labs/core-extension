import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';
import * as path from 'node:path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const shardId = process.env.PLAYWRIGHT_SHARD || '';

const testRailOptions = {
  embedAnnotationsAsProperties: true,
  outputFile: shardId
    ? path.resolve(
        __dirname,
        '..',
        'test-results',
        `junit-report-${shardId}.xml`,
      )
    : path.resolve(__dirname, '..', 'test-results', 'junit-report.xml'),
};

/**
 * Worker configuration:
 * - Local: Uses all available CPU cores (undefined = 100% parallelization)
 * - CI: Limited to 1 worker per shard because launchPersistentContext (required
 *   for extensions) only allows one browser instance at a time
 *
 * To increase parallelism in CI, increase the number of shards instead.
 */
const getWorkers = () => {
  if (!process.env.CI) {
    return undefined;
  }
  // Extension tests with persistent context run serially
  return 1;
};

/**
 * Fully parallel mode allows tests within a single file to run in parallel.
 * Disabled in CI to ensure more stable test execution with extension.
 */
const fullyParallel = !process.env.CI;

export const baseConfig: PlaywrightTestConfig = {
  globalSetup: path.resolve(__dirname, 'global-setup.ts'),
  testDir: path.resolve(__dirname, '..', 'tests'),
  testMatch: '**/*.spec.ts',
  outputDir: path.resolve(__dirname, '..', 'test-results'),
  timeout: 60000, // Reduced for debugging
  expect: { timeout: 5000 }, // Reduced for debugging
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: getWorkers(),
  fullyParallel: fullyParallel,
  reporter: process.env.CI
    ? [['junit', testRailOptions], ['list']]
    : [['html'], ['list']],

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
};

export default defineConfig(baseConfig);
