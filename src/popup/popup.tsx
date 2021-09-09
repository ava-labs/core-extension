import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { WalletHome } from '@src/pages/Wallet/WalletHome';
import { Deposit } from '@src/pages/Deposit';
import Header from '@src/components/common/Header/Header';
import { Footer } from '@src/components/common/Footer';
import {
  HorizontalFlex,
  LoadingIcon,
  VerticalFlex,
} from '@avalabs/react-components';

const WalletOverview = React.lazy(() => {
  return import('../pages/Wallet/WalletOverview');
});

const AddToken = React.lazy(() => {
  return import('../pages/AddToken/AddToken');
});

const SignMessage = React.lazy(() => {
  return import('../pages/SignMessage/SignMessage');
});

const Send = React.lazy(() => {
  return import('../pages/Send/Send');
});

const PermissionsPage = React.lazy(() => {
  return import('../pages/Permissions/Permissions');
});

const SignTransactionPage = React.lazy(() => {
  return import('../pages/SignTransaction/SignTransactionPage');
});

const SettingsPage = React.lazy(() => {
  return import('../pages/Settings/SettingsPage');
});

import { WalletContextProvider } from '@src/contexts/WalletProvider';
import { NetworkContextProvider } from '@src/contexts/NetworkProvider';
import { ConnectionContextProvider } from '@src/contexts/ConnectionProvider';
import { OnboardingContextProvider } from '@src/contexts/OnboardingProvider';
import { SettingsContextProvider } from '@src/contexts/SettingsProvider';
import { GlobalStyle } from '@src/styles/styles';
import { useState } from 'react';
import styled from 'styled-components';

export function Popup() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <ConnectionContextProvider>
        <OnboardingContextProvider>
          <NetworkContextProvider>
            <WalletContextProvider>
              <SettingsContextProvider>
                <VerticalFlex height={'100%'} maxHeight={drawerOpen ? "100%" : 'auto'} overflow={drawerOpen ? 'hidden' : 'auto'}>
                  <Header onDrawerStateChanged={setDrawerOpen} /> 
                  <HorizontalFlex flex={1} justify={'center'}>
                    <Switch>
                      <Route path="/token/add">
                        <React.Suspense fallback={<LoadingIcon />}>
                          <AddToken />
                        </React.Suspense>
                      </Route>

                      <Route path="/wallet/overview">
                        <React.Suspense fallback={<LoadingIcon />}>
                          <WalletOverview />
                        </React.Suspense>
                      </Route>

                      <Route path="/wallet">
                        <WalletHome />
                      </Route>

                      <Route path="/deposit">
                        <Deposit />
                      </Route>

                      <Route path="/sign/transaction">
                        <React.Suspense fallback={<LoadingIcon />}>
                          <SignTransactionPage />
                        </React.Suspense>
                      </Route>

                      <Route path="/send">
                        <React.Suspense fallback={<LoadingIcon />}>
                          <Send />
                        </React.Suspense>
                      </Route>

                      <Route path="/sign">
                        <React.Suspense fallback={<LoadingIcon />}>
                          <SignMessage />
                        </React.Suspense>
                      </Route>

                      <Route path="/permissions">
                        <React.Suspense fallback={<LoadingIcon />}>
                          <PermissionsPage />
                        </React.Suspense>
                      </Route>

                      <Route path="/settings">
                        <React.Suspense fallback={<LoadingIcon />}>
                          <SettingsPage />
                        </React.Suspense>
                      </Route>

                      <Route path="/">
                        <Redirect to="/wallet" />
                      </Route>
                    </Switch>
                  </HorizontalFlex>
                  <Footer />
                </VerticalFlex>
              </SettingsContextProvider>
            </WalletContextProvider>
          </NetworkContextProvider>
        </OnboardingContextProvider>
      </ConnectionContextProvider>
      <GlobalStyle />
    </>
  );
}

export default Popup;
