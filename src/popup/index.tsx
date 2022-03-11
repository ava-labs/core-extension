import { lazy, Suspense } from 'react';
import { render } from 'react-dom';
import { browser } from 'webextension-polyfill-ts';
// MemoryRouter doesn't handle deep linking well.  And BrowserRouter doesn't work in extensions.
import { HashRouter as Router } from 'react-router-dom';
import {
  LoadingIcon,
  ThemeContextProvider,
  Toaster,
  walletThemeDark,
} from '@avalabs/react-components';
import { ConnectionContextProvider } from '@src/contexts/ConnectionProvider';

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
          <Toaster />
          <Suspense fallback={<LoadingIcon />}>
            <App />
          </Suspense>
        </ConnectionContextProvider>
      </ThemeContextProvider>
    </Router>,
    document.getElementById('popup')
  );
});
