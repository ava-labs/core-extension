import {
  CircularProgress,
  IconButton,
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

export function App() {
  const preferredColorScheme = usePreferredColorScheme();
  const history = useHistory();

  if (!preferredColorScheme) {
    return <CircularProgress />;
  }

  return (
    <ThemeProvider theme={preferredColorScheme}>
      <PersonalAvatarProvider>
        <AccountsContextProvider>
          <NetworkContextProvider>
            <LedgerContextProvider>
              <KeystoneContextProvider>
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
                        path="/import-wallet/seedphrase"
                        component={ImportSeedphraseFlow}
                      />
                      <Route
                        path="/"
                        render={() => (
                          <div>
                            <div>Under construction 🚧</div>
                            <IconButton
                              onClick={() =>
                                history.push('/account-management')
                              }
                            >
                              <MdSwitchAccount />
                            </IconButton>
                          </div>
                        )}
                      />
                    </Switch>
                  </WalletContextProvider>
                </OnboardingContextProvider>
              </KeystoneContextProvider>
            </LedgerContextProvider>
          </NetworkContextProvider>
        </AccountsContextProvider>
      </PersonalAvatarProvider>
    </ThemeProvider>
  );
}
