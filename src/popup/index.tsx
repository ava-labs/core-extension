import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browser } from 'webextension-polyfill-ts';
const App = React.lazy(() => {
  return import(/* webpackChunkName: 'App'  */ './popup');
});
import { HashRouter as Router } from 'react-router-dom';
import {
  LoadingIcon,
  ThemeContextProvider,
  walletThemeDark,
} from '@avalabs/react-components';

browser.tabs.query({ active: true }).then(() => {
  ReactDOM.render(
    <Router>
      <ThemeContextProvider
        lightTheme={walletThemeDark} // Always show dark until we reenable light-mode (CP-578)
        darkTheme={walletThemeDark}
      >
        <React.Suspense fallback={<LoadingIcon />}>
          <App />
        </React.Suspense>
      </ThemeContextProvider>
    </Router>,
    document.getElementById('popup')
  );
});
