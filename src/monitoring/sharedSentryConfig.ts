import browser from 'webextension-polyfill';

const sharedSentryConfig = {
  dsn: process.env.SENTRY_DSN,
  environment: process.env.RELEASE || 'dev',
  release: `core-extension@${browser.runtime.getManifest().version}`,
  debug: process.env.SENTRY_DEBUG === 'true',
  tracesSampleRate: 0.003,
  ignoreErrors: [
    /^.*The user aborted a request\.$/, // ignore errors caused by chrome's throttling
    /^.*could not detect network.*$/, // ignore ethers provider connection errors
    /^.*Failed to fetch$/, // ignore network errors
  ],
};

export default sharedSentryConfig;
