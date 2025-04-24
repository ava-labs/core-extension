import { Stack } from '@avalabs/core-k2-components';
import { Header } from '@/components/common/header/Header';
import { WalletLoading } from '@/components/common/WalletLoading';
import { AccountsContextProvider } from '@/contexts/AccountsProvider';
import { BalancesProvider } from '@/contexts/BalancesProvider';
import { BridgeProvider } from '@/contexts/BridgeProvider';
import { ContactsContextProvider } from '@/contexts/ContactsProvider';
import { useFeatureFlagContext } from '@/contexts/FeatureFlagsProvider';
import { LedgerContextProvider } from '@/contexts/LedgerProvider';
import { NetworkContextProvider } from '@/contexts/NetworkProvider';
import { OnboardingContextProvider } from '@/contexts/OnboardingProvider';
import { PermissionContextProvider } from '@/contexts/PermissionsProvider';
import { SwapContextProvider } from '@/contexts/SwapProvider/SwapProvider';
import { WalletContextProvider } from '@/contexts/WalletProvider';
import { useAppDimensions } from '@/hooks/useAppDimensions';
import {
  useIsSpecificContextContainer,
} from '@/hooks/useIsSpecificContextContainer';
import { useOnline } from '@/hooks/useOnline';
import { usePageHistory } from '@/hooks/usePageHistory';
import { DialogContextProvider } from '@/contexts/DialogContextProvider';

import { useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { OfflineContent } from './OfflineContent';
import { useTranslation } from 'react-i18next';
import LedgerIncorrectDevice from '@/pages/Ledger/LedgerIncorrectDevice';
import LedgerRegisterBtcWalletPolicy from '@/pages/Ledger/LedgerRegisterBtcWalletPolicy';
import { KeystoneContextProvider } from '@/contexts/KeystoneProvider';
import { CurrenciesContextProvider } from '@/contexts/CurrenciesProvider';
import { DefiContextProvider } from '@/contexts/DefiProvider';
import { WalletConnectContextProvider } from '@/contexts/WalletConnectContextProvider';
import { ContextContainer, FeatureGates } from '@core/types';
import { TestnetBanner } from '@/components/common/TestnetBanner';
import { SeedlessAuthPrompt } from '@/components/common/seedless/SeedlessAuthPrompt';
import { UnifiedBridgeProvider } from '@/contexts/UnifiedBridgeProvider';
import { AnalyticsOptInDialog } from '@/components/dialogs/AnalyticsOptInDialog';
import { SeedlessMfaManagementProvider } from '@/contexts/SeedlessMfaManagementProvider';
import { ApprovalsContextProvider } from '@/contexts/ApprovalsProvider';
import { ApprovalRoutes } from './ApprovalRoutes';
import { AppRoutes } from './AppRoutes';
import { InAppApprovalOverlay } from '@/components/common/InAppApprovalOverlay';
import { NetworkFeeContextProvider } from '@/contexts/NetworkFeeProvider';

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
          <OnboardingContextProvider>
            <AccountsContextProvider>
              <NetworkContextProvider>
                <NetworkFeeContextProvider>
                  <WalletContextProvider>
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
                                                <SeedlessAuthPrompt />
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
                  </WalletContextProvider>
                </NetworkFeeContextProvider>
              </NetworkContextProvider>
            </AccountsContextProvider>
          </OnboardingContextProvider>
        </KeystoneContextProvider>
      </LedgerContextProvider>
    </DialogContextProvider>
  );
}
