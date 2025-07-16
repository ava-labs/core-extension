import {
  CircularProgress,
  IconButton,
  Stack,
  ThemeProvider,
  toast,
} from '@avalabs/k2-alpine';
import {
  AccountsContextProvider,
  KeystoneContextProvider,
  LedgerContextProvider,
  NetworkContextProvider,
  OnboardingContextProvider,
  usePreferredColorScheme,
  WalletContextProvider,
} from '@core/ui';

import { PersonalAvatarProvider } from '@/components/PersonalAvatar/context';
import AccountManagement from '@/pages/AccountManagement/AccountManagement';
import { LockScreen } from '@/pages/LockScreen';
import { Onboarding } from '@/pages/Onboarding';
import { MdSwitchAccount } from 'react-icons/md';
import { Route, Switch, useHistory } from 'react-router-dom';
import { ImportSeedphraseFlow } from '@/pages/Import/ImportSeedphraseFlow';

import { Providers } from '.';
import { Header } from '@/components/Header';
import { Children, ReactElement } from 'react';

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
      providers={
        Children.toArray([
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
          <PersonalAvatarProvider />,
          <KeystoneContextProvider />,
        ]) as ReactElement[]
      }
    >
      <div>
        {displayHeader && (
          <Stack sx={{ width: 1 }}>
            <Header />
          </Stack>
        )}
        <Switch>
          <Route path="/account-management" component={AccountManagement} />
          <Route
            path="/import-wallet/seedphrase"
            component={ImportSeedphraseFlow}
          />
          <Route
            path="/"
            render={() => (
              <>
                <div>Under construction 🚧</div>
                <IconButton onClick={() => history.push('/account-management')}>
                  <MdSwitchAccount />
                </IconButton>
              </>
            )}
          />
        </Switch>
      </div>
    </Providers>
  );
}
