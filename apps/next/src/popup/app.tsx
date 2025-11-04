import {
  CircularProgress,
  Stack,
  ThemeProvider,
  toast,
} from '@avalabs/k2-alpine';
import {
  AccountsContextProvider,
  AnalyticsContextProvider,
  ApprovalsContextProvider,
  BalancesProvider,
  ContactsContextProvider,
  CurrenciesContextProvider,
  isSpecificContextContainer,
  KeystoneContextProvider,
  LedgerContextProvider,
  NetworkContextProvider,
  NetworkFeeContextProvider,
  OnboardingContextProvider,
  PermissionContextProvider,
  usePageHistory,
  usePreferredColorScheme,
  WalletContextProvider,
} from '@core/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PersonalAvatarProvider } from '@/components/PersonalAvatar/context';
import { LockScreen } from '@/pages/LockScreen';
import { Onboarding } from '@/pages/Onboarding';
import { ContextContainer } from '@core/types';
import { useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Header } from '@/components/Header';
import { InAppApprovalOverlay } from '@/components/InAppApprovalOverlay';
import { getContactsPath, getSendPath } from '@/config/routes';
import { AppRoutes, ApprovalRoutes } from '@/routing';
import { Children, ReactElement } from 'react';
import { Providers } from './providers';

const pagesWithoutHeader = [
  '/account-management',
  '/settings',
  '/receive',
  '/approve',
  '/permissions',
  '/manage-tokens',
  getContactsPath(),
  getSendPath(),
];

// Create a client for React Query
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
  const historyRef = useRef(history);
  historyRef.current = history;
  const { setNavigationHistory, getNavigationHistoryState } = usePageHistory();
  const navigationHistory = getNavigationHistoryState();

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
          <ThemeProvider theme={preferredColorScheme} />,
          <QueryClientProvider client={queryClient} />,
          <AnalyticsContextProvider />,
          <PersonalAvatarProvider />,
          <OnboardingContextProvider
            onError={(message: string) => toast.error(message)}
            LoadingComponent={CircularProgress}
            OnboardingScreen={Onboarding}
          />,
          <AccountsContextProvider />,
          <NetworkContextProvider />,
          <LedgerContextProvider />,
          <KeystoneContextProvider />,
          <WalletContextProvider LockedComponent={LockScreen} />,
          <ContactsContextProvider />,
          <BalancesProvider />,
          <PermissionContextProvider />,
          <CurrenciesContextProvider />,
          <NetworkFeeContextProvider />,
          <ApprovalsContextProvider />,
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
      </>
    </Providers>
  );
}
