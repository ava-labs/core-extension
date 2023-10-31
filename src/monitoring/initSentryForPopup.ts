import * as Sentry from '@sentry/react';
import sharedSentryConfig from './sharedSentryConfig';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    ...sharedSentryConfig,
    integrations: [
      /**
       * eliminating dom and history from the breadcrumbs. This should eliminate
       * a massive amount of the daa leaks into sentry. If we find that console
       * is leaking data, suspected that it might, than we can review the leak and
       * see if we cant modify the data before it is recorded. This can be
       * done in the sentry options beforeBreadcrumbs function.
       */
      new Sentry.Integrations.Breadcrumbs({
        dom: false,
        history: false,
        console: false,
      }),
      // TODO: add routing instruments v6 (https://ava-labs.atlassian.net/browse/CP-7443)
      new Sentry.BrowserTracing(),
    ],
  });
}
