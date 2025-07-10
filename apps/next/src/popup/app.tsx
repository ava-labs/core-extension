import {
  CircularProgress,
  IconButton,
  Stack,
  ThemeProvider,
  toast,
} from '@avalabs/k2-alpine';
import {
  AccountsContextProvider,
  LedgerContextProvider,
  NetworkContextProvider,
  OnboardingContextProvider,
  usePreferredColorScheme,
  WalletContextProvider,
} from '@core/ui';

import AccountManagement from '@/pages/AccountManagement/AccountManagement';
import { LockScreen } from '@/pages/LockScreen';
import { Onboarding } from '@/pages/Onboarding';
import { MdSwitchAccount } from 'react-icons/md';
import { Route, Switch, useHistory } from 'react-router-dom';

import { Providers } from '.';
import { Header } from '@/components/Header';
import { Children } from 'react';

const pagesWithoutHeader = ['/account-management'];

export function App() {
  const preferredColorScheme = usePreferredColorScheme();
  const history = useHistory();

  if (!preferredColorScheme) {
    return <CircularProgress />;
  }

  const displayHeader = !pagesWithoutHeader.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <Providers
      providers={Children.toArray([
        <ThemeProvider theme={preferredColorScheme} />,
        <AccountsContextProvider />,
        <NetworkContextProvider />,
        <OnboardingContextProvider
          onError={(message: string) => toast.error(message)}
          LoadingComponent={CircularProgress}
          OnboardingScreen={Onboarding}
        />,
        <WalletContextProvider LockedComponent={LockScreen} />,
        <LedgerContextProvider />,
      ])}
    >
      <Switch>
        <Route path="/account-management" component={AccountManagement} />
        <Route
          path="/"
          render={() => (
            <div>
              {displayHeader && (
                <Stack sx={{ width: 1 }}>
                  <Header />
                </Stack>
              )}
              <div>Under construction 🚧</div>
              <IconButton onClick={() => history.push('/account-management')}>
                <MdSwitchAccount />
              </IconButton>
            </div>
          )}
        />
      </Switch>
    </Providers>
  );
}
