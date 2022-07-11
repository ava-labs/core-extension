import * as Sentry from '@sentry/browser';
import { browser } from 'webextension-polyfill-ts';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.RELEASE || 'dev',
    release: `core-extension@${browser.runtime.getManifest().version}`,
    debug: process.env.NODE_ENV === 'development',
  });
}
