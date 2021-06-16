import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browser } from 'webextension-polyfill-ts';
import { Popup as App } from './popup';
import { HashRouter as Router } from 'react-router-dom';
import { store, StoreContext } from '@src/store/store';
import '@src/i18n';

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
  ReactDOM.render(
    <Router>
      <StoreContext.Provider value={store}>
        <React.Suspense fallback='Loading...'>
          <App />
        </React.Suspense>
      </StoreContext.Provider>
    </Router>,
    document.getElementById('popup')
  );
});
