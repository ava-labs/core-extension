import {
  ThemeProvider,
  toast,
  CircularProgress,
  Stack,
} from '@avalabs/k2-alpine';
import {
  AccountsContextProvider,
  NetworkContextProvider,
  OnboardingContextProvider,
  usePreferredColorScheme,
  WalletContextProvider,
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
          <OnboardingContextProvider
            onError={(message: string) => toast.error(message)}
            LoadingComponent={CircularProgress}
            OnboardingScreen={Onboarding}
          >
            <WalletContextProvider LockedComponent={LockScreen}>
              <Stack direction="row" justifyContent="space-between">
                <AccountManagement />
                Under construction 🚧
              </Stack>
            </WalletContextProvider>
          </OnboardingContextProvider>
        </NetworkContextProvider>
      </AccountsContextProvider>
    </ThemeProvider>
  );
}
