import {
  CircularProgress,
  Stack,
  ThemeProvider,
  toast,
} from '@avalabs/k2-alpine';
import {
  AccountsContextProvider,
  BalancesProvider,
  ContactsContextProvider,
  CurrenciesContextProvider,
  isSpecificContextContainer,
  KeystoneContextProvider,
  LedgerContextProvider,
  NetworkContextProvider,
  OnboardingContextProvider,
  PermissionContextProvider,
  SeedlessMfaManagementProvider,
  usePageHistory,
  usePreferredColorScheme,
  WalletContextProvider,
} from '@core/ui';

import { PersonalAvatarProvider } from '@/components/PersonalAvatar/context';
import AccountManagement from '@/pages/AccountManagement/AccountManagement';
import { Contacts } from '@/pages/Contacts';
import { ImportLedgerFlow, ImportSeedphraseFlow } from '@/pages/Import';
import { LockScreen } from '@/pages/LockScreen';
import { Onboarding } from '@/pages/Onboarding';
import { Receive } from '@/pages/Receive';
import { Settings } from '@/pages/Settings';
import { ContextContainer } from '@core/types';
import { useEffect, useRef } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';

import { Header } from '@/components/Header';
import { Portfolio } from '@/pages/Portfolio';
import { Children, ReactElement } from 'react';
import { Providers } from './providers';
import { getContactsPath, getSendPath } from '@/config/routes';
import { Send } from '@/pages/Send';

const pagesWithoutHeader = [
  '/account-management',
  '/settings',
  '/receive',
  getContactsPath(),
  getSendPath(),
];

export function App() {
  const preferredColorScheme = usePreferredColorScheme();
  const { pathname } = useLocation();
  const history = useHistory();
  const historyRef = useRef(history);
  historyRef.current = history;
  const { setNavigationHistory, getNavigationHistoryState } = usePageHistory();
  const navigationHistory = getNavigationHistoryState();

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
          <PersonalAvatarProvider />,
          <ThemeProvider theme={preferredColorScheme} />,
          <AccountsContextProvider />,
          <NetworkContextProvider />,
          <SeedlessMfaManagementProvider />,
          <OnboardingContextProvider
            onError={(message: string) => toast.error(message)}
            LoadingComponent={CircularProgress}
            OnboardingScreen={Onboarding}
          />,
          <WalletContextProvider LockedComponent={LockScreen} />,
          <LedgerContextProvider />,
          <KeystoneContextProvider />,
          <ContactsContextProvider />,
          <BalancesProvider />,
          <CurrenciesContextProvider />,
          <PermissionContextProvider />,
        ]) as ReactElement[]
      }
    >
      <>
        {displayHeader && (
          <Stack sx={{ width: 1 }}>
            <Header />
          </Stack>
        )}
        <Switch>
          <Route path="/receive" component={Receive} />
          <Route path="/settings" component={Settings} />
          <Route path={getContactsPath()} component={Contacts} />
          <Route path="/account-management" component={AccountManagement} />
          <Route
            path="/import-wallet/seedphrase"
            component={ImportSeedphraseFlow}
          />
          <Route
            path="/import-wallet/ledger/:phase?"
            component={ImportLedgerFlow}
          />
          <Route path={getSendPath()} component={Send} />
          <Route path="/" component={Portfolio} />
        </Switch>
      </>
    </Providers>
  );
}
