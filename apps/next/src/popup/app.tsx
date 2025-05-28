import { ThemeProvider, toast, CircularProgress } from '@avalabs/k2-alpine';
import {
  AccountsContextProvider,
  NetworkContextProvider,
  OnboardingContextProvider,
  usePreferredColorScheme,
  WalletContextProvider,
} from '@core/ui';

import { Onboarding } from '@/pages/Onboarding';
import { LockScreen } from '@/pages/LockScreen';
import { Providers } from '.';

export function App() {
  const preferredColorScheme = usePreferredColorScheme();

  if (!preferredColorScheme) {
    return <CircularProgress />;
  }

  return (
    <Providers
      providers={[
        <ThemeProvider theme={preferredColorScheme} key={0} />,
        <AccountsContextProvider key={1} />,
        <NetworkContextProvider key={2} />,
        <OnboardingContextProvider
          onError={(message: string) => toast.error(message)}
          LoadingComponent={CircularProgress}
          OnboardingScreen={Onboarding}
          key={3}
        />,
        <WalletContextProvider LockedComponent={LockScreen} key={4} />,
      ]}
    >
      <>Under construction 🚧</>
    </Providers>
  );
}
