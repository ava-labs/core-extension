import { Stack } from '@avalabs/core-k2-components';
import { Header } from '@src/components/common/header/Header';
import { WalletLoading } from '@src/components/common/WalletLoading';
import { AccountsContextProvider } from '@src/contexts/AccountsProvider';
import { BalancesProvider } from '@src/contexts/BalancesProvider';
import { BridgeProvider } from '@src/contexts/BridgeProvider';
import { ContactsContextProvider } from '@src/contexts/ContactsProvider';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { LedgerContextProvider } from '@src/contexts/LedgerProvider';
import { NetworkContextProvider } from '@src/contexts/NetworkProvider';
import { OnboardingContextProvider } from '@src/contexts/OnboardingProvider';
import { PermissionContextProvider } from '@src/contexts/PermissionsProvider';
import { SwapContextProvider } from '@src/contexts/SwapProvider/SwapProvider';
import { WalletContextProvider } from '@src/contexts/WalletProvider';
import { useAppDimensions } from '@src/hooks/useAppDimensions';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import { useOnline } from '@src/hooks/useOnline';
import { usePageHistory } from '@src/hooks/usePageHistory';
import { DialogContextProvider } from '@src/contexts/DialogContextProvider';

import { useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { OfflineContent } from './OfflineContent';
import { useTranslation } from 'react-i18next';
import LedgerIncorrectDevice from '@src/pages/Ledger/LedgerIncorrectDevice';
import LedgerRegisterBtcWalletPolicy from '@src/pages/Ledger/LedgerRegisterBtcWalletPolicy';
import { KeystoneContextProvider } from '@src/contexts/KeystoneProvider';
import { CurrenciesContextProvider } from '@src/contexts/CurrenciesProvider';
import { DefiContextProvider } from '@src/contexts/DefiProvider';
import { WalletConnectContextProvider } from '@src/contexts/WalletConnectContextProvider/WalletConnectContextProvider';
import { FeatureGates } from '@src/background/services/featureFlags/models';
import { TestnetBanner } from '@src/components/common/TestnetBanner';
import { SeedlessAuthPrompt } from '@src/components/common/seedless/SeedlessAuthPrompt';
import { UnifiedBridgeProvider } from '@src/contexts/UnifiedBridgeProvider';
import { AnalyticsOptInDialog } from '@src/components/dialogs/AnalyticsOptInDialog';
import { SeedlessMfaManagementProvider } from '@src/contexts/SeedlessMfaManagementProvider';
import { ApprovalsContextProvider } from '@src/contexts/ApprovalsProvider';
import { ApprovalRoutes } from './ApprovalRoutes';
import { AppRoutes } from './AppRoutes';
import { InAppApprovalOverlay } from '@src/components/common/InAppApprovalOverlay';
import { NetworkFeeContextProvider } from '@src/contexts/NetworkFeeProvider';
import LedgerSolanaAddressPrompt from '@src/pages/Ledger/LedgerSolanaAddressPrompt';
import { SeedlessUpdatingAccountDialog } from '@src/components/common/seedless/SeedlessUpdatingAccountDialog';
import { NotificationsContextProvider } from '@src/contexts/NotificationsProvider';

const pagesWithoutHeader = [
  '/tokens/manage',
  '/bridge/confirm',
  '/bridge/transaction-status',
  '/bridge/transaction-details',
  '/send/confirm',
  '/collectible',
  '/collectible/send/confirm',
  '/accounts',
  '/import-private-key',
  '/import-with-walletconnect',
  '/defi',
  '/fireblocks',
  '/export-private-key',
];

export function Popup() {
  const { t } = useTranslation();
  const dimensions = useAppDimensions();
  const isConfirm = useIsSpecificContextContainer(ContextContainer.CONFIRM);
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);
  const isFullscreen = useIsSpecificContextContainer(
    ContextContainer.FULLSCREEN,
  );
  const history = useHistory();
  const location = useLocation();
  const { setNavigationHistory, getNavigationHistoryState } = usePageHistory();
  const navigationHistoryState = getNavigationHistoryState();
  const { isOnline } = useOnline();
  const { featureFlags } = useFeatureFlagContext();

  const appWidth = useMemo(
    () => (isMiniMode || isConfirm || isFullscreen ? '100%' : '1280px'),
    [isMiniMode, isConfirm, isFullscreen],
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
          'Sorry, Core is currently unavailable. Please check back later. Thanks.',
        )}
      />
    );
  }

  const displayHeader =
    isMiniMode &&
    !pagesWithoutHeader.some((path) => location.pathname.startsWith(path));

  return (
    <DialogContextProvider>
      <LedgerContextProvider>
        <KeystoneContextProvider>
          <AccountsContextProvider>
            <NetworkContextProvider>
              <OnboardingContextProvider>
                <NetworkFeeContextProvider>
                  <WalletContextProvider>
                    <NotificationsContextProvider>
                      <CurrenciesContextProvider>
                        <BalancesProvider>
                          <DefiContextProvider>
                            <SwapContextProvider>
                              <UnifiedBridgeProvider>
                                <BridgeProvider>
                                  <ContactsContextProvider>
                                    <PermissionContextProvider>
                                      <WalletConnectContextProvider>
                                        <SeedlessMfaManagementProvider>
                                          <WalletLoading>
                                            <ApprovalsContextProvider>
                                              <TestnetBanner />
                                              <AnalyticsOptInDialog />
                                              <Stack
                                                sx={{
                                                  flexGrow: 1,
                                                  width: dimensions.width,
                                                  maxHeight: 'auto',
                                                  overflow: 'auto',
                                                  alignItems: 'center',
                                                  margin: 'auto',
                                                }}
                                              >
                                                {displayHeader && (
                                                  <Stack sx={{ width: 1 }}>
                                                    <Header />
                                                  </Stack>
                                                )}

                                                <Stack
                                                  direction="row"
                                                  sx={{
                                                    flexGrow: 1,
                                                    justifyContent: 'center',
                                                    py: isMiniMode ? 0 : 2,
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                    width: appWidth,
                                                  }}
                                                >
                                                  {isConfirm ? (
                                                    <ApprovalRoutes />
                                                  ) : (
                                                    <AppRoutes />
                                                  )}
                                                  <LedgerIncorrectDevice />
                                                  <LedgerRegisterBtcWalletPolicy />
                                                  <LedgerSolanaAddressPrompt />
                                                  <SeedlessAuthPrompt />
                                                  <SeedlessUpdatingAccountDialog />
                                                  {isMiniMode && (
                                                    <InAppApprovalOverlay />
                                                  )}
                                                </Stack>
                                              </Stack>
                                            </ApprovalsContextProvider>
                                          </WalletLoading>
                                        </SeedlessMfaManagementProvider>
                                      </WalletConnectContextProvider>
                                    </PermissionContextProvider>
                                  </ContactsContextProvider>
                                </BridgeProvider>
                              </UnifiedBridgeProvider>
                            </SwapContextProvider>
                          </DefiContextProvider>
                        </BalancesProvider>
                      </CurrenciesContextProvider>
                    </NotificationsContextProvider>
                  </WalletContextProvider>
                </NetworkFeeContextProvider>
              </OnboardingContextProvider>
            </NetworkContextProvider>
          </AccountsContextProvider>
        </KeystoneContextProvider>
      </LedgerContextProvider>
    </DialogContextProvider>
  );
}
