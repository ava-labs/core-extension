import {
  CircularProgress,
  Stack,
  ThemeProvider,
  toast,
} from '@avalabs/k2-alpine';
import {
  AccountsContextProvider,
  ApprovalsContextProvider,
  BalancesProvider,
  ContactsContextProvider,
  CurrenciesContextProvider,
  DefiContextProvider,
  FirebaseContextProvider,
  isSpecificContextContainer,
  KeystoneContextProvider,
  LedgerContextProvider,
  NetworkFeeContextProvider,
  OnboardingContextProvider,
  PermissionContextProvider,
  SeedlessMfaManagementProvider,
  SwapContextProvider,
  useNetworkContext,
  usePageHistory,
  usePreferredColorScheme,
  WalletContextProvider,
} from '@core/ui';

import { PersonalAvatarProvider } from '@/components/PersonalAvatar/context';
import { LockScreen } from '@/pages/LockScreen';
import { Onboarding } from '@/pages/Onboarding';
import { ContextContainer } from '@core/types';
import { useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Header } from '@/components/Header';
import { InAppApprovalOverlay } from '@/components/InAppApprovalOverlay';
import { LoadingScreen } from '@/components/LoadingScreen';
import { getContactsPath, getSendPath, getSwapPath } from '@/config/routes';
import { useSwapCallbacks } from '@/pages/Swap';
import { AppRoutes, ApprovalRoutes } from '@/routing';
import { Children, ReactElement } from 'react';
import { Providers } from './providers';
import { LedgerRegisterBtcWalletPolicy } from '@/components/ledger/LedgerRegisterBtcWalletPolicy';

const pagesWithoutHeader = [
  '/account-management',
  '/settings',
  '/receive',
  '/approve',
  '/permissions',
  '/network/switch',
  '/manage-tokens',
  '/trending',
  '/defi',
  getContactsPath(),
  getSendPath(),
  getSwapPath(),
  '/concierge',
];

export function App() {
  const preferredColorScheme = usePreferredColorScheme();
  const { pathname } = useLocation();
  const history = useHistory();
  const historyRef = useRef(history);
  historyRef.current = history;
  const { setNavigationHistory, getNavigationHistoryState } = usePageHistory();
  const navigationHistory = getNavigationHistoryState();

  const { isDeveloperMode } = useNetworkContext();
  const isApprovalContext = isSpecificContextContainer(
    ContextContainer.CONFIRM,
  );
  const isAppContext =
    isSpecificContextContainer(ContextContainer.POPUP) ||
    isSpecificContextContainer(ContextContainer.SIDE_PANEL);

  const swapToastCallbacks = useSwapCallbacks();

  useEffect(() => {
    /* The list of contexts that should support navigation history */
    const supportedContexts = [
      ContextContainer.POPUP,
      ContextContainer.SIDE_PANEL,
    ];
    if (!supportedContexts.some(isSpecificContextContainer)) {
      return;
    }
    if (Object.keys(navigationHistory).length !== 0) {
      historyRef.current.push(navigationHistory.location); // go to last visited route
    }

    return historyRef.current.listen(() => {
      setNavigationHistory(historyRef.current);
    });
  }, [navigationHistory, setNavigationHistory]);

  if (!preferredColorScheme) {
    return (
      <Stack justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Stack>
    );
  }

  const displayHeader = !pagesWithoutHeader.some((path) =>
    pathname.startsWith(path),
  );

  return (
    <Providers
      providers={
        Children.toArray([
          <ThemeProvider
            theme={isDeveloperMode ? 'dark' : preferredColorScheme}
          />,
          <PersonalAvatarProvider />,
          <LedgerContextProvider />,
          <KeystoneContextProvider />,
          <OnboardingContextProvider
            onError={(message: string) => toast.error(message)}
            LoadingComponent={LoadingScreen}
            OnboardingScreen={Onboarding}
          />,
          <AccountsContextProvider />,
          <LedgerContextProvider />,
          <KeystoneContextProvider />,
          <WalletContextProvider
            LockedComponent={LockScreen}
            LoadingComponent={LoadingScreen}
          />,
          <SeedlessMfaManagementProvider />,
          <ContactsContextProvider />,
          <BalancesProvider />,
          <PermissionContextProvider />,
          <CurrenciesContextProvider />,
          <NetworkFeeContextProvider />,
          <ApprovalsContextProvider />,
          <SwapContextProvider {...swapToastCallbacks} />,
          <DefiContextProvider />,
          <FirebaseContextProvider />,
        ]) as ReactElement[]
      }
    >
      <>
        {displayHeader && (
          <Stack sx={{ width: 1 }}>
            <Header />
          </Stack>
        )}
        {isApprovalContext ? <ApprovalRoutes /> : <AppRoutes />}
        {isAppContext && <InAppApprovalOverlay />}
        <LedgerRegisterBtcWalletPolicy />
      </>
    </Providers>
  );
}
