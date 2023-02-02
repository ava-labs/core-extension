// initialize sentry first to enable error collection
import '../utils/initSentry';

import { lazy, Suspense } from 'react';
import { render } from 'react-dom';
import browser from 'webextension-polyfill';
// MemoryRouter doesn't handle deep linking well.  And BrowserRouter doesn't work in extensions.
import { HashRouter as Router } from 'react-router-dom';
import {
  ThemeContextProvider,
  Toaster,
  walletThemeDark,
} from '@avalabs/react-components';
import { ConnectionContextProvider } from '@src/contexts/ConnectionProvider';
import { AnalyticsContextProvider } from '@src/contexts/AnalyticsProvider';
import { SettingsContextProvider } from '@src/contexts/SettingsProvider';
import { LoadingContent } from './LoadingContent';
import { FeatureFlagsContextProvider } from '@src/contexts/FeatureFlagsProvider';
import { I18nextProvider } from 'react-i18next';
import i18n from '@src/localization/init';
import { darkTheme, ThemeProvider } from '@avalabs/k2-components';

const App = lazy(() => {
  return import(/* webpackChunkName: 'App'  */ './popup').then((m) => ({
    default: m.Popup,
  }));
});

browser.tabs.query({ active: true }).then(() => {
  render(
    <Router>
      <ThemeProvider
        toasterProps={{
          position: 'top-center',
        }}
        theme={darkTheme}
      >
        <ThemeContextProvider
          lightTheme={walletThemeDark} // Always show dark until we reenable light-mode (CP-578)
          darkTheme={walletThemeDark}
        >
          <I18nextProvider i18n={i18n}>
            <ConnectionContextProvider>
              <SettingsContextProvider>
                <FeatureFlagsContextProvider>
                  <AnalyticsContextProvider>
                    <Toaster />
                    <Suspense fallback={<LoadingContent />}>
                      <App />
                    </Suspense>
                  </AnalyticsContextProvider>
                </FeatureFlagsContextProvider>
              </SettingsContextProvider>
            </ConnectionContextProvider>
          </I18nextProvider>
        </ThemeContextProvider>
      </ThemeProvider>
    </Router>,
    document.getElementById('popup')
  );
});
