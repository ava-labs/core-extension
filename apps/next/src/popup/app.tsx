import {
  CircularProgress,
  IconButton,
  ThemeProvider,
  toast,
} from '@avalabs/k2-alpine';
import {
  AccountsContextProvider,
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

export function App() {
  const preferredColorScheme = usePreferredColorScheme();
  const history = useHistory();

  if (!preferredColorScheme) {
    return <CircularProgress />;
  }

  return (
    <ThemeProvider theme={preferredColorScheme}>
      <AccountsContextProvider>
        <NetworkContextProvider>
          <OnboardingContextProvider
            onError={(message: string) => toast.error(message)}
            LoadingComponent={CircularProgress}
            OnboardingScreen={Onboarding}
          >
            <WalletContextProvider LockedComponent={LockScreen}>
              <Switch>
                <Route
                  path="/account-management"
                  component={AccountManagement}
                />
                <Route
                  path="/"
                  render={() => (
                    <div>
                      <div>Under construction 🚧</div>
                      <IconButton
                        onClick={() => history.push('/account-management')}
                      >
                        <MdSwitchAccount />
                      </IconButton>
                    </div>
                  )}
                />
              </Switch>
            </WalletContextProvider>
          </OnboardingContextProvider>
        </NetworkContextProvider>
      </AccountsContextProvider>
    </ThemeProvider>
  );
}
