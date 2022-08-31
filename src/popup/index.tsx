// initialize sentry first to enable error collection
import '../utils/initSentry';

import { lazy, Suspense } from 'react';
import { render } from 'react-dom';
import { browser } from 'webextension-polyfill-ts';
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

const App = lazy(() => {
  return import(/* webpackChunkName: 'App'  */ './popup').then((m) => ({
    default: m.Popup,
  }));
});

browser.tabs.query({ active: true }).then(() => {
  render(
    <Router>
      <ThemeContextProvider
        lightTheme={walletThemeDark} // Always show dark until we reenable light-mode (CP-578)
        darkTheme={walletThemeDark}
      >
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
      </ThemeContextProvider>
    </Router>,
    document.getElementById('popup')
  );
});
