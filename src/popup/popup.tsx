import React, { useMemo, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import {
  HorizontalFlex,
  LoadingIcon,
  VerticalFlex,
  DialogContextProvider,
  Toaster,
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
  return import('../pages/SignTransaction/SignTransactionFlow');
});

const SettingsPage = React.lazy(() => {
  return import('../pages/Settings/SettingsPage');
});

const TokenFlowPage = React.lazy(() => {
  return import('../pages/Wallet/TokenFlow.minimode');
});

const ActivityFlow = React.lazy(() => {
  return import('../pages/Activity/ActivityFlow');
});

const Swap = React.lazy(() => {
  return import('../pages/Swap/Swap');
});

import { WalletContextProvider } from '@src/contexts/WalletProvider';
import { NetworkContextProvider } from '@src/contexts/NetworkProvider';
import { ConnectionContextProvider } from '@src/contexts/ConnectionProvider';
import { OnboardingContextProvider } from '@src/contexts/OnboardingProvider';
import { SettingsContextProvider } from '@src/contexts/SettingsProvider';
import { HomeFlow } from '@src/pages/Home/HomeFlow';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import { GlobalStyles } from '@src/styles';
import { AccountsContextProvider } from '@src/contexts/AccountsProvider';
import { HeaderFlow } from '@src/components/common/header/HeaderFlow';
import { ReceiveFlow } from '@src/pages/Receive/ReceiveFlow';
import { WalletHomeSend } from '@src/pages/Send/WalletHomeSend';
import { SwapContextProvider } from '@src/contexts/SwapProvider';
import { useAppDimensions } from '@src/hooks/useAppDimensions';

export function Popup() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dimensions = useAppDimensions();
  const isConfirm = useIsSpecificContextContainer(ContextContainer.CONFIRM);
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);
  const appWidth = useMemo(
    () => (isMiniMode || isConfirm ? '100%' : '1280px'),
    []
  );

  return (
    <DialogContextProvider>
      <ConnectionContextProvider>
        <SettingsContextProvider>
          <OnboardingContextProvider>
            <NetworkContextProvider>
              <AccountsContextProvider>
                <WalletContextProvider>
                  <SwapContextProvider>
                    <GlobalStyles />
                    <Toaster />

                    <VerticalFlex
                      height={dimensions.height}
                      width={dimensions.width}
                      maxHeight={drawerOpen ? '100%' : 'auto'}
                      overflow={drawerOpen ? 'hidden' : 'auto'}
                      align="center"
                      margin="auto"
                    >
                      <VerticalFlex width="100%">
                        {!isConfirm ? (
                          <HeaderFlow onDrawerStateChanged={setDrawerOpen} />
                        ) : (
                          ''
                        )}
                      </VerticalFlex>

                      <HorizontalFlex
                        flex={1}
                        justify={'center'}
                        margin={isMiniMode ? '' : '16px 0'}
                        maxWidth={isMiniMode ? '100%' : '90%'}
                        width={appWidth}
                      >
                        <Switch>
                          <Route path="/token/add">
                            <React.Suspense fallback={<LoadingIcon />}>
                              <AddToken />
                            </React.Suspense>
                          </Route>

                          <Route path="/home">
                            <HomeFlow />
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

                          <Route path="/token">
                            <React.Suspense fallback={<LoadingIcon />}>
                              <TokenFlowPage />
                            </React.Suspense>
                          </Route>

                          <Route path="/receive">
                            <React.Suspense fallback={<LoadingIcon />}>
                              <ReceiveFlow />
                            </React.Suspense>
                          </Route>

                          <Route path="/send">
                            <React.Suspense fallback={<LoadingIcon />}>
                              <WalletHomeSend />
                            </React.Suspense>
                          </Route>

                          <Route path="/activity">
                            <React.Suspense fallback={<LoadingIcon />}>
                              <ActivityFlow />
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

                          <Route path="/swap">
                            <React.Suspense fallback={<LoadingIcon />}>
                              <Swap />
                            </React.Suspense>
                          </Route>

                          {isMiniMode ? (
                            <Route path="/token">
                              <React.Suspense fallback={<LoadingIcon />}>
                                <TokenFlowPage />
                              </React.Suspense>
                            </Route>
                          ) : (
                            ''
                          )}

                          <Route path="/">
                            <Redirect to="/home" />
                          </Route>
                        </Switch>
                      </HorizontalFlex>
                    </VerticalFlex>
                  </SwapContextProvider>
                </WalletContextProvider>
              </AccountsContextProvider>
            </NetworkContextProvider>
          </OnboardingContextProvider>
        </SettingsContextProvider>
      </ConnectionContextProvider>
    </DialogContextProvider>
  );
}

export default Popup;
