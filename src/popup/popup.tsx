import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import { observer } from 'mobx-react-lite';

import { GlobalStyle, ExtensionContainer } from '@src/styles/styles';
import styled, { ThemeProvider } from 'styled-components';
import darkModeTheme from '@src/styles/dark';
import lightModeTheme from '@src/styles/light';

import { useStore } from '@src/store/store';
import { Welcome } from '@src/pages/Welcome';
import { FirstTimeFlow } from '@src/pages/FirstTimeFlow';
import { Import } from '@src/pages/Import';
import { CreateWallet } from '@src/pages/CreateWallet';
import { WalletHome } from '@src/pages/WalletHome';
import { WalletOverview } from '@src/pages/WalletOverview';
import { Deposit } from '@src/pages/Deposit';
import { Send } from '@src/pages/Send';
import { SendConfirm } from '@src/pages/SendConfirm';
import { SendSuccess } from '@src/pages/SendSuccess';
import { SignMessage } from '@src/pages/SignMessage';
import { AddToken } from '@src/components/AddToken';

export const Popup = observer((): React.ReactElement => {
  const { themeStore, networkStore, walletStore } = useStore();

  // remove setTimeout later
  // when sdk is updated

  useEffect(() => {
    networkStore.changeNetwork('testnet');
    setTimeout(() => {
      walletStore.MnemonicWallet();
    }, 1500);
    browser.runtime.sendMessage({ popupMounted: true });
  }, []);

  return (
    <ThemeProvider
      theme={themeStore.isDarkMode ? darkModeTheme : lightModeTheme}
    >
      <ExtensionContainer>
        <Switch>
          <Route path="/welcome/create">
            <CreateWallet />
          </Route>

          <Route path="/welcome">
            <Welcome />
          </Route>

          <Route path="/import">
            <Import />
          </Route>

          <Route path="/token/add">
            <AddToken />
          </Route>

          <Route path="/wallet/overview">
            <WalletOverview />
          </Route>

          <Route path="/wallet">
            <WalletHome />
          </Route>

          <Route path="/deposit">
            <Deposit />
          </Route>

          <Route path="/send/confirm">
            <SendConfirm />
          </Route>

          <Route path="/send/success">
            <SendSuccess />
          </Route>

          <Route path="/send">
            <Send />
          </Route>

          <Route path="/sign">
            <SignMessage />
          </Route>

          <Route path="/">
            <FirstTimeFlow />
          </Route>
        </Switch>
        <GlobalStyle />
      </ExtensionContainer>
    </ThemeProvider>
  );
});
