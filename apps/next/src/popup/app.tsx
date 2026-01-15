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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PersonalAvatarProvider } from '@/components/PersonalAvatar/context';
import { AccountInfoVisibilityProvider } from '@/contexts/AccountInfoVisibilityContext';
import { ConfettiProvider } from '@/components/Confetti';
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
import { AppRoutes, ApprovalRoutes } from '@/routing';
import { Children, ReactElement } from 'react';
import { Providers } from './providers';
import { EventDrivenComponentsAndHooks } from './components';
import { LedgerPolicyRegistrationStateProvider } from '@/contexts';
import { TransactionStatusProviderWithConfetti } from '@/components/Transactions/TransactionsProviderWithConfetti';
import { ScrollDetectionProvider } from '@/contexts/ScrollDetectionContext';

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
  '/networks/add-popup',
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
            toastVariant="extension"
          />,
          <QueryClientProvider client={queryClient} />,
          <ConfettiProvider />,
          <PersonalAvatarProvider />,
          <AccountInfoVisibilityProvider />,
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
          <SwapContextProvider />,
          <DefiContextProvider />,
          <FirebaseContextProvider />,
          <NextUnifiedBridgeProvider />,
          <LedgerPolicyRegistrationStateProvider />,
          <TransactionStatusProviderWithConfetti />,
          <ScrollDetectionProvider />,
        ]) as ReactElement[]
      }
    >
      <Stack
        height="100%"
        width={1}
        overflow="auto"
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
        }}
      >
        {displayHeader && (
          <Stack
            width={1}
            position="sticky"
            top={0}
            zIndex={10}
            id="header-container"
          >
            <Header />
          </Stack>
        )}
        {isApprovalContext ? <ApprovalRoutes /> : <AppRoutes />}
        {isAppContext && <InAppApprovalOverlay />}

        <EventDrivenComponentsAndHooks />
      </Stack>
    </Providers>
  );
}
