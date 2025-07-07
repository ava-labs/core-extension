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
import { lazy, ReactElement, Suspense } from 'react';
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
type ProviderElement = ReactElement<
  unknown,
  string | React.JSXElementConstructor<any>
>;

export const Providers = ({
  providers,
  children,
}: {
  providers: ProviderElement[];
  children: ProviderElement;
}) => {
  const renderProvider = (
    renderedProviders: ProviderElement[],
    renderedChildren: ProviderElement,
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
          providers={[
            <I18nextProvider i18n={i18next} key={0} />,
            <ConnectionContextProvider
              LoadingComponent={CircularProgress}
              key={1}
            />,
            <SettingsContextProvider key={2} />,
            <FeatureFlagsContextProvider key={3} />,
            <AnalyticsContextProvider key={4} />,
            <Suspense fallback={<CircularProgress />} key={5} />,
          ]}
        >
          <App />
        </Providers>
      </Router>
    </Sentry.ErrorBoundary>,
  );
});
