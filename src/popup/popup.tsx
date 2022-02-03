import { lazy, useMemo, Suspense, useEffect, useState } from 'react';
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation,
} from 'react-router-dom';
import {
  HorizontalFlex,
  LoadingIcon,
  VerticalFlex,
  DialogContextProvider,
  Toaster,
} from '@avalabs/react-components';
import { WalletContextProvider } from '@src/contexts/WalletProvider';
import { NetworkContextProvider } from '@src/contexts/NetworkProvider';
import { ConnectionContextProvider } from '@src/contexts/ConnectionProvider';
import { OnboardingContextProvider } from '@src/contexts/OnboardingProvider';
import { ContactsContextProvider } from '@src/contexts/ContactsProvider';
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
import { SwapContextProvider } from '@src/contexts/SwapProvider';
import { useAppDimensions } from '@src/hooks/useAppDimensions';
import { SignTxErrorBoundary } from '@src/pages/SignTransaction/components/SignTxErrorBoundary';
import { LedgerSupportContextProvider } from '@src/contexts/LedgerSupportProvider';

const AddToken = lazy(() => {
  return import('../pages/ManageTokens/AddToken').then((m) => ({
    default: m.AddToken,
  }));
});

const SignMessage = lazy(() => {
  return import('../pages/SignMessage/SignMessage').then((m) => ({
    default: m.SignMessage,
  }));
});

const PermissionsPage = lazy(() => {
  return import('../pages/Permissions/Permissions').then((m) => ({
    default: m.PermissionsPage,
  }));
});

const SignTransactionPage = lazy(() => {
  return import('../pages/SignTransaction/SignTransactionFlow').then((m) => ({
    default: m.SignTransactionPage,
  }));
});

const SettingsPage = lazy(() => {
  return import('../pages/Settings/SettingsPage').then((m) => ({
    default: m.SettingsPage,
  }));
});

const TokenFlowPage = lazy(() => {
  return import('../pages/Wallet/TokenFlow.minimode').then((m) => ({
    default: m.TokenFlowMiniMode,
  }));
});

const ManageTokensPage = lazy(() => {
  return import('../pages/ManageTokens/ManageTokensFlow').then((m) => ({
    default: m.ManageTokensFlow,
  }));
});

const ActivityFlow = lazy(() => {
  return import('../pages/Activity/ActivityFlow').then((m) => ({
    default: m.ActivityFlow,
  }));
});

const Swap = lazy(() => {
  return import('../pages/Swap/Swap').then((m) => ({
    default: m.Swap,
  }));
});

const SendFlow = lazy(() => {
  return import('../pages/Send/SendFlow').then((m) => ({
    default: m.SendFlow,
  }));
});

export function Popup() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const dimensions = useAppDimensions();
  const isConfirm = useIsSpecificContextContainer(ContextContainer.CONFIRM);
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);
  const localStorageHistoryKey = 'avalanche-extension-history';
  const history = useHistory();
  const location = useLocation();
  const appWidth = useMemo(
    () => (isMiniMode || isConfirm ? '100%' : '1280px'),
    [isMiniMode, isConfirm]
  );

  useEffect(() => {
    if (!isMiniMode) {
      return;
    }

    const historyFromLocalStorage = JSON.parse(
      localStorage.getItem(localStorageHistoryKey) || '{}'
    );

    if (Object.keys(historyFromLocalStorage).length !== 0) {
      history.push(historyFromLocalStorage.location); // go to last visited route
    }

    const unlisten = history.listen(() => {
      // Set history object in localStorage on each route change
      localStorage.setItem(localStorageHistoryKey, JSON.stringify(history));
    });

    return unlisten;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMiniMode]);

  return (
    <DialogContextProvider>
      <ConnectionContextProvider>
        <SettingsContextProvider>
          <LedgerSupportContextProvider>
            <OnboardingContextProvider>
              <NetworkContextProvider>
                <AccountsContextProvider>
                  <WalletContextProvider>
                    <SwapContextProvider>
                      <ContactsContextProvider>
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
                          {!location.pathname.startsWith('/tokens/manage') &&
                            !location.pathname.startsWith('/send/confirm') && (
                              <VerticalFlex width="100%">
                                {!isConfirm && (
                                  <HeaderFlow
                                    onDrawerStateChanged={setDrawerOpen}
                                  />
                                )}
                              </VerticalFlex>
                            )}

                          <HorizontalFlex
                            flex={1}
                            justify={'center'}
                            margin={isMiniMode ? '' : '16px 0'}
                            maxWidth={isMiniMode ? '100%' : '90%'}
                            width={appWidth}
                          >
                            <Switch>
                              <Route path="/token/add">
                                <Suspense fallback={<LoadingIcon />}>
                                  <AddToken />
                                </Suspense>
                              </Route>

                              <Route path="/home">
                                <HomeFlow />
                              </Route>

                              <Route path="/sign/transaction">
                                <Suspense fallback={<LoadingIcon />}>
                                  <SignTxErrorBoundary>
                                    <SignTransactionPage />
                                  </SignTxErrorBoundary>
                                </Suspense>
                              </Route>

                              <Route path="/sign">
                                <Suspense fallback={<LoadingIcon />}>
                                  <SignMessage />
                                </Suspense>
                              </Route>

                              <Route path="/permissions">
                                <Suspense fallback={<LoadingIcon />}>
                                  <PermissionsPage />
                                </Suspense>
                              </Route>

                              <Route path="/token">
                                <Suspense fallback={<LoadingIcon />}>
                                  <TokenFlowPage />
                                </Suspense>
                              </Route>

                              <Route path="/receive">
                                <Suspense fallback={<LoadingIcon />}>
                                  <ReceiveFlow />
                                </Suspense>
                              </Route>

                              <Route path="/send">
                                <Suspense fallback={<LoadingIcon />}>
                                  <SendFlow />
                                </Suspense>
                              </Route>

                              <Route path="/activity">
                                <Suspense fallback={<LoadingIcon />}>
                                  <ActivityFlow />
                                </Suspense>
                              </Route>

                              <Route path="/settings">
                                <Suspense fallback={<LoadingIcon />}>
                                  <SettingsPage />
                                </Suspense>
                              </Route>

                              <Route path="/swap">
                                <Suspense fallback={<LoadingIcon />}>
                                  <Swap />
                                </Suspense>
                              </Route>

                              <Route path="/manage-tokens/add">
                                <Suspense fallback={<LoadingIcon />}>
                                  <AddToken />
                                </Suspense>
                              </Route>

                              <Route path="/manage-tokens">
                                <Suspense fallback={<LoadingIcon />}>
                                  <ManageTokensPage />
                                </Suspense>
                              </Route>

                              <Route path="/">
                                <Redirect to="/home" />
                              </Route>
                            </Switch>
                          </HorizontalFlex>
                        </VerticalFlex>
                      </ContactsContextProvider>
                    </SwapContextProvider>
                  </WalletContextProvider>
                </AccountsContextProvider>
              </NetworkContextProvider>
            </OnboardingContextProvider>
          </LedgerSupportContextProvider>
        </SettingsContextProvider>
      </ConnectionContextProvider>
    </DialogContextProvider>
  );
}
