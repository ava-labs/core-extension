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
  WalletTotalBalanceProvider,
} from '@core/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PersonalAvatarProvider } from '@/components/PersonalAvatar/context';
import { LockScreen } from '@/pages/LockScreen';
import { Onboarding } from '@/pages/Onboarding';
import { ContextContainer } from '@core/types';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Header } from '@/components/Header';
import { InAppApprovalOverlay } from '@/components/InAppApprovalOverlay';
import { LoadingScreen } from '@/components/LoadingScreen';
import * as routes from '@/config/routes';
import { NextUnifiedBridgeProvider } from '@/pages/Bridge/contexts';
import { useSwapCallbacks } from '@/pages/Swap';
import { AppRoutes, ApprovalRoutes } from '@/routing';
import { Children, ReactElement } from 'react';
import { Providers } from './providers';
import { EventDrivenComponentsAndHooks } from './components';

const pagesWithoutHeader = [
  '/seedless-auth',
  '/account-management',
  '/settings',
  '/receive',
  '/approve',
  '/permissions',
  '/network/switch',
  '/manage-tokens',
  '/trending',
  '/defi',
  '/concierge',
  '/activity',
  routes.getContactsPath(),
  routes.getSendPath(),
  routes.getSwapPath(),
  routes.getBridgePath(),
  '/asset', // Token details path
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export function App() {
  const preferredColorScheme = usePreferredColorScheme();
  const { pathname } = useLocation();
  const history = useHistory();
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
      history.push(navigationHistory.location); // go to last visited route
    }

    return history.listen(() => {
      setNavigationHistory(history);
    });
  }, [history, navigationHistory, setNavigationHistory]);

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
          <QueryClientProvider client={queryClient} />,
          <PersonalAvatarProvider />,
          <LedgerContextProvider />,
          <KeystoneContextProvider />,
          <OnboardingContextProvider
            onError={(message: string) => toast.error(message)}
            LoadingComponent={LoadingScreen}
            OnboardingScreen={Onboarding}
          />,
          <AccountsContextProvider />,
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
          <NextUnifiedBridgeProvider />,
          <WalletTotalBalanceProvider />,
        ]) as ReactElement[]
      }
    >
      <>
        {displayHeader && (
          <Stack width={1}>
            <Header />
          </Stack>
        )}
        {isApprovalContext ? <ApprovalRoutes /> : <AppRoutes />}
        {isAppContext && <InAppApprovalOverlay />}

        <EventDrivenComponentsAndHooks />
      </>
    </Providers>
  );
}
