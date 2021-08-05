import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browser } from 'webextension-polyfill-ts';
const App = React.lazy(() => {
  return import(/* webpackChunkName: 'App'  */ './popup');
});
import { HashRouter as Router } from 'react-router-dom';
import { store, StoreContext } from '@src/store/store';
import '@src/i18n';
import { LoadingIcon } from '@avalabs/react-components';

browser.tabs.query({ active: true }).then(() => {
  ReactDOM.render(
    <Router>
      <StoreContext.Provider value={store}>
        <React.Suspense fallback={<LoadingIcon />}>
          <App />
        </React.Suspense>
      </StoreContext.Provider>
    </Router>,
    document.getElementById('popup')
  );
});
