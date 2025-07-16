// initialize sentry first to enable error collection
import '../monitoring/initSentryForPopup';

import * as Sentry from '@sentry/react';
import { createRoot } from 'react-dom/client';
import browser from 'webextension-polyfill';
// MemoryRouter doesn't handle deep linking well.  And BrowserRouter doesn't work in extensions.
import { CircularProgress } from '@avalabs/k2-alpine';
import {
  AnalyticsContextProvider,
  ConnectionContextProvider,
  FeatureFlagsContextProvider,
  SettingsContextProvider,
} from '@core/ui';
import { Children, lazy, ReactElement, Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import { HashRouter as Router } from 'react-router-dom';
import { initI18n, i18next } from '@core/common';
import React from 'react';

// Initialize translations
initI18n();

const App = lazy(() => {
  return import(/* webpackChunkName: 'App'  */ './app').then((m) => ({
    default: m.App,
  }));
});

const root = createRoot(document.getElementById('popup') as HTMLElement);

export const Providers = ({
  providers,
  children,
}: {
  providers: ReactElement[];
  children: ReactElement;
}) => {
  const renderProvider = (
    renderedProviders: ReactElement[],
    renderedChildren: ReactElement,
  ) => {
    const [provider, ...restProviders] = renderedProviders;

    if (provider) {
      return React.cloneElement(
        provider,
        undefined,
        renderProvider(restProviders, renderedChildren),
      );
    }

    return renderedChildren;
  };
  return renderProvider(providers, children);
};

browser.tabs.query({ active: true }).then(() => {
  root.render(
    <Sentry.ErrorBoundary>
      <Router>
        <Providers
          providers={
            Children.toArray([
              <I18nextProvider i18n={i18next} />,
              <ConnectionContextProvider LoadingComponent={CircularProgress} />,
              <SettingsContextProvider />,
              <FeatureFlagsContextProvider />,
              <AnalyticsContextProvider />,
              <Suspense fallback={<CircularProgress />} />,
            ]) as ReactElement[]
          }
        >
          <App />
        </Providers>
      </Router>
    </Sentry.ErrorBoundary>,
  );
});
