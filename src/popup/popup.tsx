import { FeatureGates } from '@avalabs/posthog-sdk';
import {
  DialogContextProvider,
  HorizontalFlex,
  LoadingIcon,
  VerticalFlex,
} from '@avalabs/react-components';
import { Header } from '@src/components/common/header/Header';
import { WalletLoading } from '@src/components/common/WalletLoading';
import { AccountsContextProvider } from '@src/contexts/AccountsProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { BalancesProvider } from '@src/contexts/BalancesProvider';
import { BridgeProvider } from '@src/contexts/BridgeProvider';
import { ContactsContextProvider } from '@src/contexts/ContactsProvider';
import { LedgerSupportContextProvider } from '@src/contexts/LedgerSupportProvider';
import { NetworkFeeContextProvider } from '@src/contexts/NetworkFeeProvider';
import { NetworkContextProvider } from '@src/contexts/NetworkProvider';
import { OnboardingContextProvider } from '@src/contexts/OnboardingProvider';
import { PermissionContextProvider } from '@src/contexts/PermissionsProvider';
import { SwapContextProvider } from '@src/contexts/SwapProvider';
import { WalletContextProvider } from '@src/contexts/WalletProvider';
import { useAppDimensions } from '@src/hooks/useAppDimensions';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import { useOnline } from '@src/hooks/useOnline';
import { usePageHistory } from '@src/hooks/usePageHistory';
import { ApproveAction } from '@src/pages/ApproveAction/ApproveAction';
import { TokenList } from '@src/pages/Home/components/Portfolio/TokenList';
import { Home } from '@src/pages/Home/Home';
import { Receive } from '@src/pages/Receive/Receive';
import { SignTxErrorBoundary } from '@src/pages/SignTransaction/components/SignTxErrorBoundary';
import { lazy, Suspense, useEffect, useMemo } from 'react';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { OfflineContent } from './OfflineContent';

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
  return import('../pages/SignTransaction/SignTransaction').then((m) => ({
    default: m.SignTransactionPage,
  }));
});

const TokenFlowPage = lazy(() => {
  return import('../pages/Wallet/TokenFlow').then((m) => ({
    default: m.TokenFlow,
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

const SendPage = lazy(() => {
  return import('../pages/Send/Send').then((m) => ({
    default: m.SendPage,
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

const LedgerConnect = lazy(() => {
  return import('../pages/Ledger/Connect').then((m) => ({
    default: m.LedgerConnect,
  }));
});

export function Popup() {
  const dimensions = useAppDimensions();
  const isConfirm = useIsSpecificContextContainer(ContextContainer.CONFIRM);
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);
  const history = useHistory();
  const location = useLocation();
  const { setNavigationHistory, getNavigationHistoryState } = usePageHistory();
  const navigationHistoryState = getNavigationHistoryState();
  const { isOnline } = useOnline();
  const { flags } = useAnalyticsContext();

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

  if (!isOnline) {
    return (
      <OfflineContent message="Ooops... It seems you don't have internet connection" />
    );
  }

  if (!flags[FeatureGates.EVERYTHING]) {
    return (
      <OfflineContent message="Sorry, Core is currently unavailable. Please check back later. Thanks." />
    );
  }

  return (
    <DialogContextProvider>
      <LedgerSupportContextProvider>
        <OnboardingContextProvider>
          <NetworkContextProvider>
            <AccountsContextProvider>
              <BalancesProvider>
                <NetworkFeeContextProvider>
                  <WalletContextProvider>
                    <SwapContextProvider>
                      <BridgeProvider>
                        <ContactsContextProvider>
                          <PermissionContextProvider>
                            <WalletLoading>
                              <VerticalFlex
                                height={dimensions.height}
                                width={dimensions.width}
                                maxHeight={'auto'}
                                overflow={'auto'}
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
                                    {!isConfirm && <Header />}
                                  </VerticalFlex>
                                )}{' '}
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

                                    <Route path="/ledger/connect">
                                      <Suspense fallback={<LoadingIcon />}>
                                        <LedgerConnect />
                                      </Suspense>
                                    </Route>

                                    <Route path="/sign">
                                      <Suspense fallback={<LoadingIcon />}>
                                        <SignMessage />
                                      </Suspense>
                                    </Route>

                                    <Route path="/approve">
                                      <Suspense fallback={<LoadingIcon />}>
                                        <ApproveAction />
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
                                        <SendPage />
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

                                    <Route path="/tokenlist">
                                      <Suspense fallback={<LoadingIcon />}>
                                        <TokenList />
                                      </Suspense>
                                    </Route>

                                    <Route path="/">
                                      <Redirect to="/home" />
                                    </Route>
                                  </Switch>
                                </HorizontalFlex>
                              </VerticalFlex>
                            </WalletLoading>
                          </PermissionContextProvider>
                        </ContactsContextProvider>
                      </BridgeProvider>
                    </SwapContextProvider>
                  </WalletContextProvider>
                </NetworkFeeContextProvider>
              </BalancesProvider>
            </AccountsContextProvider>
          </NetworkContextProvider>
        </OnboardingContextProvider>
      </LedgerSupportContextProvider>
    </DialogContextProvider>
  );
}
