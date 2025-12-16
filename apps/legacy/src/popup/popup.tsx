import { Stack, toast } from '@avalabs/core-k2-components';
import { Header } from '@/components/common/header/Header';
import { WalletLoading } from '@/components/common/WalletLoading';
import { AccountsContextProvider } from '@core/ui';
import { BalancesProvider } from '@core/ui';
import { BridgeProvider } from '@core/ui';
import { ContactsContextProvider } from '@core/ui';
import { useFeatureFlagContext } from '@core/ui';
import { LedgerContextProvider } from '@core/ui';
import { NetworkContextProvider } from '@core/ui';
import { OnboardingContextProvider } from '@core/ui';
import { PermissionContextProvider } from '@core/ui';
import { SwapContextProvider } from '@core/ui';
import { WalletContextProvider } from '@core/ui';
import { useAppDimensions } from '@core/ui';
import { useIsSpecificContextContainer } from '@core/ui';
import { useOnline } from '@core/ui';
import { usePageHistory } from '@core/ui';

import { useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { OfflineContent } from './OfflineContent';
import { useTranslation } from 'react-i18next';
import LedgerIncorrectDevice from '@/pages/Ledger/LedgerIncorrectDevice';
import LedgerRegisterBtcWalletPolicy from '@/pages/Ledger/LedgerRegisterBtcWalletPolicy';
import { KeystoneContextProvider } from '@core/ui';
import { CurrenciesContextProvider } from '@core/ui';
import { DefiContextProvider } from '@core/ui';
import { WalletConnectContextProvider } from '@core/ui';
import { ContextContainer, FeatureGates } from '@core/types';
import { TestnetBanner } from '@/components/common/TestnetBanner';
import { SeedlessAuthPrompt } from '@/components/common/seedless/SeedlessAuthPrompt';
import { UnifiedBridgeProvider } from '@core/ui';
import { AnalyticsOptInDialog } from '@/components/dialogs/AnalyticsOptInDialog';
import { SeedlessMfaManagementProvider } from '@core/ui';
import { ApprovalsContextProvider } from '@core/ui';
import { ApprovalRoutes } from './ApprovalRoutes';
import { AppRoutes } from './AppRoutes';
import { InAppApprovalOverlay } from '@/components/common/InAppApprovalOverlay';
import { NetworkFeeContextProvider } from '@core/ui';
import LedgerSolanaAddressPrompt from '@/pages/Ledger/LedgerSolanaAddressPrompt';
import { FirebaseContextProvider } from '@core/ui';
import { NotificationsContextProvider } from '@core/ui';
import { WalletLocked } from '@/pages/Wallet/WalletLocked';
import { Onboarding } from '@/pages/Onboarding/Onboarding';
import { LoadingContent } from './LoadingContent';
import { DialogContextProvider } from '@/contexts/DialogContextProvider';
import { WhatsNewModal } from '@/components/announcements';

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
              <OnboardingContextProvider
                LoadingComponent={LoadingContent}
                OnboardingScreen={Onboarding}
                onError={(message: string) =>
                  toast.error(message, {
                    duration: 3000,
                  })
                }
              >
                <NetworkFeeContextProvider>
                  <WalletContextProvider
                    LockedComponent={WalletLocked}
                    LoadingComponent={LoadingContent}
                  >
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
                                        <FirebaseContextProvider>
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
                                                    <WhatsNewModal />
                                                    {isMiniMode && (
                                                      <InAppApprovalOverlay />
                                                    )}
                                                  </Stack>
                                                </Stack>
                                              </ApprovalsContextProvider>
                                            </WalletLoading>
                                          </SeedlessMfaManagementProvider>
                                        </FirebaseContextProvider>
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
