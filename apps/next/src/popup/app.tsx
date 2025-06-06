import {
  ThemeProvider,
  toast,
  CircularProgress,
  Stack,
} from '@avalabs/k2-alpine';
import {
  AccountsContextProvider,
  BalancesProvider,
  NetworkContextProvider,
  OnboardingContextProvider,
  usePreferredColorScheme,
  WalletContextProvider,
  WalletTotalBalanceProvider,
} from '@core/ui';

import { Onboarding } from '@/pages/Onboarding';
import { LockScreen } from '@/pages/LockScreen';
import AccountManagement from '@/pages/AccountManagement/AccountManagement';

export function App() {
  const preferredColorScheme = usePreferredColorScheme();

  if (!preferredColorScheme) {
    return <CircularProgress />;
  }

  return (
    <ThemeProvider theme={preferredColorScheme}>
      <AccountsContextProvider>
        <NetworkContextProvider>
          <BalancesProvider>
            <OnboardingContextProvider
              onError={(message: string) => toast.error(message)}
              LoadingComponent={CircularProgress}
              OnboardingScreen={Onboarding}
            >
              <WalletContextProvider LockedComponent={LockScreen}>
                <WalletTotalBalanceProvider>
                  <Stack direction="row" justifyContent="space-between">
                    <AccountManagement />
                    Under construction 🚧
                  </Stack>
                </WalletTotalBalanceProvider>
              </WalletContextProvider>
            </OnboardingContextProvider>
          </BalancesProvider>
        </NetworkContextProvider>
      </AccountsContextProvider>
    </ThemeProvider>
  );
}
