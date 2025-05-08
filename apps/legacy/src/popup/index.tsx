// initialize sentry first to enable error collection
import '../monitoring/initSentryForPopup';

import * as Sentry from '@sentry/react';
import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import browser from 'webextension-polyfill';
// MemoryRouter doesn't handle deep linking well.  And BrowserRouter doesn't work in extensions.
import { HashRouter as Router } from 'react-router-dom';
import { ConnectionContextProvider } from '@core/ui';
import { AnalyticsContextProvider } from '@core/ui';
import { SettingsContextProvider } from '@core/ui';
import { LoadingContent } from './LoadingContent';
import { FeatureFlagsContextProvider } from '@core/ui';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/localization/init';
import { darkTheme, ThemeProvider } from '@avalabs/core-k2-components';

const App = lazy(() => {
  return import(/* webpackChunkName: 'App'  */ './popup').then((m) => ({
    default: m.Popup,
  }));
});
const root = createRoot(document.getElementById('popup')!);

browser.tabs.query({ active: true }).then(() => {
  root.render(
    <Sentry.ErrorBoundary>
      <Router>
        <ThemeProvider
          toasterProps={{
            position: 'top-center',
          }}
          theme={darkTheme}
          withResponsiveFontSizes={false}
        >
          <I18nextProvider i18n={i18n}>
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
  );
});
