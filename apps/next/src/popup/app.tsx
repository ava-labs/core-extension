import { CircularProgress, ThemeProvider, toast } from '@avalabs/k2-alpine';
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
import { UnderConstruction } from '@/components/UnderConstruction';
import { ViewModeSwitcher } from '@/components/ViewModeSwitcher';
import AccountManagement from '@/pages/AccountManagement/AccountManagement';
import { ImportSeedphraseFlow } from '@/pages/Import/ImportSeedphraseFlow';
import { LockScreen } from '@/pages/LockScreen';
import { Onboarding } from '@/pages/Onboarding';
import { Route, Switch } from 'react-router-dom';

export function App() {
  const preferredColorScheme = usePreferredColorScheme();

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
                  <ViewModeSwitcher />
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
                      <Route path="/" component={UnderConstruction} />
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
