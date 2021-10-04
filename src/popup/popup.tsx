import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from '@src/components/common/header/Header';
import {
  HorizontalFlex,
  LoadingIcon,
  VerticalFlex,
} from '@avalabs/react-components';

const AddToken = React.lazy(() => {
  return import('../pages/AddToken/AddToken');
});

const SignMessage = React.lazy(() => {
  return import('../pages/SignMessage/SignMessage');
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
import { Home } from '@src/pages/Home/Home';

export function Popup() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <ConnectionContextProvider>
        <OnboardingContextProvider>
          <NetworkContextProvider>
            <WalletContextProvider>
              <SettingsContextProvider>
                <VerticalFlex
                  height={'100%'}
                  maxHeight={drawerOpen ? '100%' : 'auto'}
                  overflow={drawerOpen ? 'hidden' : 'auto'}
                  align="center"
                >
                  <VerticalFlex width="100%">
                    <Header onDrawerStateChanged={setDrawerOpen} />
                  </VerticalFlex>

                  <HorizontalFlex
                    flex={1}
                    justify={'center'}
                    margin="16px 0"
                    maxWidth="90%"
                    width="1280px"
                  >
                    <Switch>
                      <Route path="/token/add">
                        <React.Suspense fallback={<LoadingIcon />}>
                          <AddToken />
                        </React.Suspense>
                      </Route>

                      <Route path="/home">
                        <Home />
                      </Route>

                      <Route path="/sign/transaction">
                        <React.Suspense fallback={<LoadingIcon />}>
                          <SignTransactionPage />
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
                        <Redirect to="/home" />
                      </Route>
                    </Switch>
                  </HorizontalFlex>
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
