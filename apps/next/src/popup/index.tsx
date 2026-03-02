// initialize sentry first to enable error collection
import '../monitoring/initSentryForPopup';

import { LoadingScreen } from '@/components/LoadingScreen';
import { i18next, initI18n } from '@core/common';
import {
  AnalyticsContextProvider,
  ConnectionContextProvider,
  FeatureFlagsContextProvider,
  NetworkContextProvider,
  SettingsContextProvider,
} from '@core/ui';
import * as Sentry from '@sentry/react';
import { Children, lazy, ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { HashRouter as Router } from 'react-router-dom'; // MemoryRouter doesn't handle deep linking well.  And BrowserRouter doesn't work in extensions.
import browser from 'webextension-polyfill';
import { Providers } from './providers';

// Initialize translations
initI18n();

const App = lazy(() => {
  return import(/* webpackChunkName: 'App'  */ './app').then((m) => ({
    default: m.App,
  }));
});

const root = createRoot(document.getElementById('popup') as HTMLElement);

browser.tabs.query({ active: true }).then(() => {
  root.render(
    <Sentry.ErrorBoundary>
      <Router>
        <Providers
          providers={
            Children.toArray([
              <I18nextProvider i18n={i18next} />,
              <ConnectionContextProvider LoadingComponent={LoadingScreen} />,
              <SettingsContextProvider />,
              <FeatureFlagsContextProvider />,
              <AnalyticsContextProvider />,
              <NetworkContextProvider />,
            ]) as ReactElement[]
          }
        >
          <App />
        </Providers>
      </Router>
    </Sentry.ErrorBoundary>,
  );
});
