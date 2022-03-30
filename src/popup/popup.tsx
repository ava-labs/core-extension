import { lazy, useMemo, Suspense, useEffect, useState } from 'react';
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation,
} from 'react-router-dom';
import {
  DialogContextProvider,
  HorizontalFlex,
  LoadingIcon,
  VerticalFlex,
} from '@avalabs/react-components';
import { HeaderFlow } from '@src/components/common/header/HeaderFlow';
import { AccountsContextProvider } from '@src/contexts/AccountsProvider';
import { WalletContextProvider } from '@src/contexts/WalletProvider';
import { NetworkContextProvider } from '@src/contexts/NetworkProvider';
import { OnboardingContextProvider } from '@src/contexts/OnboardingProvider';
import { SettingsContextProvider } from '@src/contexts/SettingsProvider';
import { SwapContextProvider } from '@src/contexts/SwapProvider';
import { useAppDimensions } from '@src/hooks/useAppDimensions';
import { ContactsContextProvider } from '@src/contexts/ContactsProvider';
import { Home } from '@src/pages/Home/Home';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import { BridgeProvider } from '@src/contexts/BridgeProvider';
import { Receive } from '@src/pages/Receive/Receive';
import { SignTxErrorBoundary } from '@src/pages/SignTransaction/components/SignTxErrorBoundary';
import { LedgerSupportContextProvider } from '@src/contexts/LedgerSupportProvider';
import { PermissionContextProvider } from '@src/contexts/PermissionsProvider';
import { usePageHistory } from '@src/hooks/usePageHistory';

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

const TokenFlowPage = lazy(() => {
  return import('../pages/Wallet/TokenFlow.minimode').then((m) => ({
    default: m.TokenFlowMiniMode,
  }));
});

const ManageTokensPage = lazy(() => {
  return import('../pages/ManageTokens/ManageTokens').then((m) => ({
    default: m.ManageTokens,
  }));
});

const Swap = lazy(() => {
  return import('../pages/Swap/Swap').then((m) => ({
    default: m.Swap,
  }));
});

const Bridge = lazy(() => {
  return import('../pages/Bridge/Bridge');
});

const BridgeTransactionStatus = lazy(() => {
  return import('../pages/Bridge/BridgeTransactionStatus');
});

const SendFlow = lazy(() => {
  return import('../pages/Send/SendFlow').then((m) => ({
    default: m.SendFlow,
  }));
});

const CollectibleDetails = lazy(() => {
  return import('../pages/Collectibles/CollectibleDetails').then((m) => ({
    default: m.CollectibleDetails,
  }));
});

const CollectibleSend = lazy(() => {
  return import('../pages/Collectibles/CollectibleSend').then((m) => ({
    default: m.CollectibleSend,
  }));
});

export function Popup() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const dimensions = useAppDimensions();
  const isConfirm = useIsSpecificContextContainer(ContextContainer.CONFIRM);
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);
  const history = useHistory();
  const location = useLocation();
  const { setNavigationHistory, getNavigationHistoryState } = usePageHistory();
  const navigationHistoryState = getNavigationHistoryState();

  const appWidth = useMemo(
    () => (isMiniMode || isConfirm ? '100%' : '1280px'),
    [isMiniMode, isConfirm]
  );

  useEffect(() => {
    if (!isMiniMode) {
      return;
    }

    const navigationHistory = navigationHistoryState;

    if (Object.keys(navigationHistory).length !== 0) {
      history.push(navigationHistory.location); // go to last visited route
    }

    const unlisten = history.listen(() => {
      // Set history object in localStorage on each route change
      setNavigationHistory(history);
    });

    return unlisten;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMiniMode, navigationHistoryState]);

  return (
    <DialogContextProvider>
      <SettingsContextProvider>
        <LedgerSupportContextProvider>
          <OnboardingContextProvider>
            <NetworkContextProvider>
              <AccountsContextProvider>
                <WalletContextProvider>
                  <SwapContextProvider>
                    <BridgeProvider>
                      <ContactsContextProvider>
                        <PermissionContextProvider>
                          <VerticalFlex
                            height={dimensions.height}
                            width={dimensions.width}
                            maxHeight={drawerOpen ? '100%' : 'auto'}
                            overflow={drawerOpen ? 'hidden' : 'auto'}
                            align="center"
                            margin="auto"
                          >
                            {![
                              '/tokens/manage',
                              '/bridge/transaction-status',
                              '/bridge/transaction-details',
                              '/send/confirm',
                              '/collectible/send/confirm',
                            ].some((path) =>
                              location.pathname.startsWith(path)
                            ) && (
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
                              maxWidth="100%"
                              width={appWidth}
                            >
                              <Switch>
                                <Route path="/token/add">
                                  <Suspense fallback={<LoadingIcon />}>
                                    <AddToken />
                                  </Suspense>
                                </Route>

                                <Route path="/home">
                                  <Home />
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

                                <Route path="/collectible/send">
                                  <Suspense fallback={<LoadingIcon />}>
                                    <CollectibleSend />
                                  </Suspense>
                                </Route>

                                <Route path="/collectible">
                                  <Suspense fallback={<LoadingIcon />}>
                                    <CollectibleDetails />
                                  </Suspense>
                                </Route>

                                <Route path="/receive">
                                  <Suspense fallback={<LoadingIcon />}>
                                    <Receive />
                                  </Suspense>
                                </Route>

                                <Route path="/send">
                                  <Suspense fallback={<LoadingIcon />}>
                                    <SendFlow />
                                  </Suspense>
                                </Route>

                                <Route path="/swap">
                                  <Suspense fallback={<LoadingIcon />}>
                                    <Swap />
                                  </Suspense>
                                </Route>

                                <Route path="/bridge/transaction-status/:sourceBlockchain/:txHash/:txTimestamp">
                                  <Suspense fallback={<LoadingIcon />}>
                                    <BridgeTransactionStatus />
                                  </Suspense>
                                </Route>

                                <Route path="/bridge">
                                  <Suspense fallback={<LoadingIcon />}>
                                    <Bridge />
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
                        </PermissionContextProvider>
                      </ContactsContextProvider>
                    </BridgeProvider>
                  </SwapContextProvider>
                </WalletContextProvider>
              </AccountsContextProvider>
            </NetworkContextProvider>
          </OnboardingContextProvider>
        </LedgerSupportContextProvider>
      </SettingsContextProvider>
    </DialogContextProvider>
  );
}
