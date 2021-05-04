import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import { GlobalStyle, ExtensionContainer } from '@src/styles/styles';

import { Welcome } from '@src/pages/Welcome';
import { FirstTimeFlow } from '@src/pages/FirstTimeFlow';
import { Import } from '@src/pages/Import';
import { CreateWallet } from '@src/pages/CreateWallet';
import { WalletHome } from '@src/pages/WalletHome';
import { Deposit } from '@src/pages/Deposit';
import { Send } from '@src/pages/Send';
import { SendConfirm } from '@src/pages/SendConfirm';

export const Popup = (): React.ReactElement => {
  // Sends the `popupMounted` event
  React.useEffect(() => {
    browser.runtime.sendMessage({ popupMounted: true });
  }, []);

  return (
    <ExtensionContainer>
      <Switch>
        <Route path='/welcome/create'>
          <CreateWallet />
        </Route>

        <Route path='/welcome'>
          <Welcome />
        </Route>

        <Route path='/import'>
          <Import />
        </Route>

        <Route path='/wallet'>
          <WalletHome />
        </Route>

        <Route path='/deposit'>
          <Deposit />
        </Route>

        <Route path='/send/confirm'>
          <SendConfirm />
        </Route>

        <Route path='/send'>
          <Send />
        </Route>

        <Route path='/'>
          <FirstTimeFlow />
        </Route>
      </Switch>
      <GlobalStyle />
    </ExtensionContainer>
  );
};
