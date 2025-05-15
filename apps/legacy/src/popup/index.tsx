// initialize sentry first to enable error collection
import '../monitoring/initSentryForPopup';

import * as Sentry from '@sentry/react';
import { lazy, Suspense } from 'react';
import { render } from 'react-dom';
import browser from 'webextension-polyfill';
// MemoryRouter doesn't handle deep linking well.  And BrowserRouter doesn't work in extensions.
import { HashRouter as Router } from 'react-router-dom';
import { ConnectionContextProvider } from '@core/ui';
import { AnalyticsContextProvider } from '@core/ui';
import { SettingsContextProvider } from '@core/ui';
import { LoadingContent } from './LoadingContent';
import { FeatureFlagsContextProvider } from '@core/ui';
import { I18nextProvider } from 'react-i18next';
import { initI18n, i18next } from '@core/common';
import { darkTheme, ThemeProvider } from '@avalabs/core-k2-components';

// Initialize translations
initI18n();

const App = lazy(() => {
  return import(/* webpackChunkName: 'App'  */ './popup').then((m) => ({
    default: m.Popup,
  }));
});
browser.tabs.query({ active: true }).then(() => {
  render(
    <Sentry.ErrorBoundary>
      <Router>
        <ThemeProvider
          toasterProps={{
            position: 'top-center',
          }}
          theme={darkTheme}
          withResponsiveFontSizes={false}
        >
          <I18nextProvider i18n={i18next}>
            <ConnectionContextProvider LoadingComponent={LoadingContent}>
              <SettingsContextProvider>
                <FeatureFlagsContextProvider>
                  <AnalyticsContextProvider>
                    <Suspense fallback={<LoadingContent />}>
                      <App />
                    </Suspense>
                  </AnalyticsContextProvider>
                </FeatureFlagsContextProvider>
              </SettingsContextProvider>
            </ConnectionContextProvider>
          </I18nextProvider>
        </ThemeProvider>
      </Router>
    </Sentry.ErrorBoundary>,
    document.getElementById('popup'),
  );
});
