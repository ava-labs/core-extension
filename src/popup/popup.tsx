import { CircularProgress } from '@avalabs/k2-components';
import { FeatureGates } from '@avalabs/posthog-sdk';
import {
  DialogContextProvider as DialogContextProviderOld,
  HorizontalFlex,
  LoadingIcon,
  VerticalFlex,
} from '@avalabs/react-components';
import { Header } from '@src/components/common/header/Header';
import { WalletLoading } from '@src/components/common/WalletLoading';
import { AccountsContextProvider } from '@src/contexts/AccountsProvider';
import { BalancesProvider } from '@src/contexts/BalancesProvider';
import { BridgeProvider } from '@src/contexts/BridgeProvider';
import { ContactsContextProvider } from '@src/contexts/ContactsProvider';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { LedgerContextProvider } from '@src/contexts/LedgerProvider';
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
import { Home } from '@src/pages/Home/Home';
import { Networks } from '@src/pages/Networks';
import { AddNetwork } from '@src/pages/Networks/AddNetwork';
import { EditNetwork } from '@src/pages/Networks/EditNetwork';
import { NetworkDetails } from '@src/pages/Networks/NetworkDetails';
import { Receive } from '@src/pages/Receive/Receive';
import { Buy } from '@src/pages/Buy/Buy';
import { SignTxErrorBoundary } from '@src/pages/SignTransaction/components/SignTxErrorBoundary';
import { Accounts } from '@src/pages/Accounts/Accounts';
import { DialogContextProvider } from '@src/contexts/DialogContextProvider';

import { lazy, Suspense, useEffect, useMemo } from 'react';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { OfflineContent } from './OfflineContent';
import { useTranslation } from 'react-i18next';
import LedgerIncorrectDevice from '@src/pages/Ledger/LedgerIncorrectDevice';
import { KeystoneContextProvider } from '@src/contexts/KeystoneProvider';
import LedgerRegisterBtcWalletPolicy from '@src/pages/Ledger/LedgerRegisterBtcWalletPolicy';
import { CurrenciesContextProvider } from '@src/contexts/CurrenciesProvider';
import { DefiProtocolDetails } from '@src/pages/DeFi/DefiProtocolDetails';
import { DefiContextProvider } from '@src/contexts/DefiProvider';

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

const WatchAssetApprovalPopup = lazy(() => {
  return import('../pages/ManageTokens/AddTokenApproval').then((m) => ({
    default: m.AddTokenApproval,
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

const ImportPrivateKeyPage = lazy(() => {
  return import('../pages/ImportPrivateKey/ImportPrivateKey').then((m) => ({
    default: m.ImportPrivateKey,
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

const SelectWallet = lazy(() => {
  return import('../pages/ApproveAction/SelectWallet').then((m) => ({
    default: m.SelectWallet,
  }));
});

const AddCustomNetworkPopup = lazy(() => {
  return import('../pages/Network/AddCustomNetworkPopup').then((m) => ({
    default: m.AddCustomNetworkPopup,
  }));
});

const SwitchActiveNetwork = lazy(() => {
  return import('../pages/Network/SwitchActiveNetwork').then((m) => ({
    default: m.SwitchActiveNetwork,
  }));
});

const SwitchAccount = lazy(() => {
  return import('../pages/Wallet/SwitchAccount').then((m) => ({
    default: m.SwitchAccount,
  }));
});

const SetDeveloperMode = lazy(() => {
  return import('../pages/ApproveAction/SetDeveloperMode').then((m) => ({
    default: m.SetDeveloperMode,
  }));
});

const UpdateContacts = lazy(() => {
  return import('../pages/ApproveAction/UpdateContacts').then((m) => ({
    default: m.UpdateContacts,
  }));
});

const AvalancheSignTx = lazy(() => {
  return import('../pages/ApproveAction/AvalancheSignTx').then((m) => ({
    default: m.AvalancheSignTx,
  }));
});

const BitcoinSignTx = lazy(() => {
  return import('../pages/ApproveAction/BitcoinSignTx').then((m) => ({
    default: m.BitcoinSignTx,
  }));
});

const Assets = lazy(() => {
  return import('../pages/Home/components/Portfolio/Assets');
});

export function Popup() {
  const { t } = useTranslation();
  const dimensions = useAppDimensions();
  const isConfirm = useIsSpecificContextContainer(ContextContainer.CONFIRM);
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);
  const history = useHistory();
  const location = useLocation();
  const { setNavigationHistory, getNavigationHistoryState } = usePageHistory();
  const navigationHistoryState = getNavigationHistoryState();
  const { isOnline } = useOnline();
  const { featureFlags } = useFeatureFlagContext();

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
      <OfflineContent
        message={t("Ooops... It seems you don't have internet connection")}
      />
    );
  }

  if (!featureFlags[FeatureGates.EVERYTHING]) {
    return (
      <OfflineContent
        message={t(
          'Sorry, Core is currently unavailable. Please check back later. Thanks.'
        )}
      />
    );
  }

  return (
    <DialogContextProviderOld>
      <DialogContextProvider>
        <LedgerContextProvider>
          <KeystoneContextProvider>
            <OnboardingContextProvider>
              <AccountsContextProvider>
                <NetworkFeeContextProvider>
                  <WalletContextProvider>
                    <NetworkContextProvider>
                      <CurrenciesContextProvider>
                        <BalancesProvider>
                          <DefiContextProvider>
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
                                          '/bridge/confirm',
                                          '/accounts',
                                          '/import-private-key',
                                          '/defi',
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
                                          padding={isMiniMode ? '' : '16px 0'}
                                          maxWidth="100%"
                                          width={appWidth}
                                          maxHeight="100%"
                                        >
                                          <Switch>
                                            <Route path="/token/add">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <AddToken />
                                              </Suspense>
                                            </Route>

                                            <Route path="/home">
                                              <Home />
                                            </Route>

                                            <Route path="/sign/transaction">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <SignTxErrorBoundary>
                                                  <SignTransactionPage />
                                                </SignTxErrorBoundary>
                                              </Suspense>
                                            </Route>

                                            <Route path="/ledger/connect">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <LedgerConnect />
                                              </Suspense>
                                            </Route>

                                            <Route path="/sign">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <SignMessage />
                                              </Suspense>
                                            </Route>

                                            <Route path="/approve/select-wallet">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <SelectWallet />
                                              </Suspense>
                                            </Route>

                                            <Route path="/approve/createContact">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <UpdateContacts method="create" />
                                              </Suspense>
                                            </Route>

                                            <Route path="/approve/updateContact">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <UpdateContacts method="update" />
                                              </Suspense>
                                            </Route>

                                            <Route path="/approve/removeContact">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <UpdateContacts method="remove" />
                                              </Suspense>
                                            </Route>

                                            <Route path="/approve/watch-asset">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <WatchAssetApprovalPopup />
                                              </Suspense>
                                            </Route>

                                            <Route path="/approve/set-developer-mode">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <SetDeveloperMode />
                                              </Suspense>
                                            </Route>

                                            <Route path="/approve/avalancheSignTx">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <AvalancheSignTx />
                                              </Suspense>
                                            </Route>

                                            <Route path="/approve/bitcoinSignTx">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <BitcoinSignTx />
                                              </Suspense>
                                            </Route>

                                            <Route path="/approve">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <ApproveAction />
                                              </Suspense>
                                            </Route>

                                            <Route path="/permissions">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <PermissionsPage />
                                              </Suspense>
                                            </Route>

                                            <Route path="/token">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <TokenFlowPage />
                                              </Suspense>
                                            </Route>

                                            <Route path="/collectible/send">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <CollectibleSend />
                                              </Suspense>
                                            </Route>

                                            <Route path="/collectible">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <CollectibleDetails />
                                              </Suspense>
                                            </Route>

                                            <Route path="/receive">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <Receive />
                                              </Suspense>
                                            </Route>

                                            <Route path="/send">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <SendPage />
                                              </Suspense>
                                            </Route>

                                            <Route path="/buy">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <Buy />
                                              </Suspense>
                                            </Route>

                                            <Route path="/swap">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <Swap />
                                              </Suspense>
                                            </Route>

                                            <Route path="/bridge/transaction-status/:sourceBlockchain/:txHash/:txTimestamp">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <BridgeTransactionStatus />
                                              </Suspense>
                                            </Route>

                                            <Route path="/bridge">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <Bridge />
                                              </Suspense>
                                            </Route>

                                            <Route path="/manage-tokens/add">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <AddToken />
                                              </Suspense>
                                            </Route>

                                            <Route path="/manage-tokens">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <ManageTokensPage />
                                              </Suspense>
                                            </Route>

                                            <Route path="/switchAccount">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <SwitchAccount />
                                              </Suspense>
                                            </Route>

                                            <Route exact path="/networks">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <Networks />
                                              </Suspense>
                                            </Route>

                                            <Route path="/networks/add">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <AddNetwork />
                                              </Suspense>
                                            </Route>

                                            <Route path="/networks/details/:networkId">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <NetworkDetails />
                                              </Suspense>
                                            </Route>

                                            <Route path="/networks/edit/:networkId">
                                              <Suspense
                                                fallback={
                                                  <CircularProgress
                                                    size={100}
                                                  />
                                                }
                                              >
                                                <EditNetwork />
                                              </Suspense>
                                            </Route>

                                            <Route path="/networks/add-popup">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <AddCustomNetworkPopup />
                                              </Suspense>
                                            </Route>

                                            <Route path="/network/switch">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <SwitchActiveNetwork />
                                              </Suspense>
                                            </Route>

                                            <Route path="/accounts">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <Accounts />
                                              </Suspense>
                                            </Route>

                                            <Route path="/import-private-key">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <ImportPrivateKeyPage />
                                              </Suspense>
                                            </Route>

                                            <Route path="/assets">
                                              <Suspense
                                                fallback={<LoadingIcon />}
                                              >
                                                <Assets />
                                              </Suspense>
                                            </Route>

                                            <Route path="/defi/:protocolId">
                                              <Suspense
                                                fallback={
                                                  <CircularProgress
                                                    size={100}
                                                  />
                                                }
                                              >
                                                <DefiProtocolDetails />
                                              </Suspense>
                                            </Route>

                                            <Route path="/">
                                              <Redirect to="/home" />
                                            </Route>
                                          </Switch>
                                          <LedgerIncorrectDevice />
                                          <LedgerRegisterBtcWalletPolicy />
                                        </HorizontalFlex>
                                      </VerticalFlex>
                                    </WalletLoading>
                                  </PermissionContextProvider>
                                </ContactsContextProvider>
                              </BridgeProvider>
                            </SwapContextProvider>
                          </DefiContextProvider>
                        </BalancesProvider>
                      </CurrenciesContextProvider>
                    </NetworkContextProvider>
                  </WalletContextProvider>
                </NetworkFeeContextProvider>
              </AccountsContextProvider>
            </OnboardingContextProvider>
          </KeystoneContextProvider>
        </LedgerContextProvider>
      </DialogContextProvider>
    </DialogContextProviderOld>
  );
}
