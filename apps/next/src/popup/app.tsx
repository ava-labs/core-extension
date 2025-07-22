import { CircularProgress, ThemeProvider, toast } from '@avalabs/k2-alpine';
import {
  AccountsContextProvider,
  KeystoneContextProvider,
  LedgerContextProvider,
  NetworkContextProvider,
  OnboardingContextProvider,
  usePageHistory,
  usePreferredColorScheme,
  WalletContextProvider,
} from '@core/ui';

import { PersonalAvatarProvider } from '@/components/PersonalAvatar/context';
import { UnderConstruction } from '@/components/UnderConstruction';
import { ViewModeSwitcher } from '@/components/ViewModeSwitcher';
import AccountManagement from '@/pages/AccountManagement/AccountManagement';
import { LockScreen } from '@/pages/LockScreen';
import { Onboarding } from '@/pages/Onboarding';
import { useEffect, useRef } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Receive } from '@/pages/Receive';
import { ImportSeedphraseFlow, ImportLedgerFlow } from '@/pages/Import';

export function App() {
  const preferredColorScheme = usePreferredColorScheme();
  const history = useHistory();
  const historyRef = useRef(history);
  historyRef.current = history;
  const { setNavigationHistory, getNavigationHistoryState } = usePageHistory();
  const navigationHistory = getNavigationHistoryState();

  useEffect(() => {
    if (Object.keys(navigationHistory).length !== 0) {
      historyRef.current.push(navigationHistory.location); // go to last visited route
    }

    return historyRef.current.listen(() => {
      setNavigationHistory(historyRef.current);
    });
  }, [navigationHistory, setNavigationHistory]);

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
                      <Route path="/receive" component={Receive} />
                      <Route
                        path="/account-management"
                        component={AccountManagement}
                      />
                      <Route
                        path="/import-wallet/seedphrase"
                        component={ImportSeedphraseFlow}
                      />
                      <Route
                        path="/import-wallet/ledger/:phase?"
                        component={ImportLedgerFlow}
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
