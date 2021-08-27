import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browser } from 'webextension-polyfill-ts';
const App = React.lazy(() => {
  return import(/* webpackChunkName: 'App'  */ './popup');
});
import { HashRouter as Router } from 'react-router-dom';
import '@src/i18n';
import { LoadingIcon, ThemeContextProvider, walletThemeDark, walletThemeLight } from '@avalabs/react-components';

browser.tabs.query({ active: true }).then(() => {
  ReactDOM.render(
    <Router>
      <ThemeContextProvider lightTheme={walletThemeLight} darkTheme={walletThemeDark}>
        <React.Suspense fallback={<LoadingIcon />}>
          <App />
        </React.Suspense>
      </ThemeContextProvider>
    </Router>,
    document.getElementById('popup')
  );
});
