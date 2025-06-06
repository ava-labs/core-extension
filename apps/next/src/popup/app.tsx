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
import { Providers } from '.';
import { Header } from '@/components/Header';

const pagesWithoutHeader = [
  '/tokens/manage',
  '/bridge/confirm',
  '/bridge/transaction-status',
  '/bridge/transaction-details',
  '/send/confirm',
  '/collectible',
  '/collectible/send/confirm',
  '/accounts',
  '/import-private-key',
  '/import-with-walletconnect',
  '/defi',
  '/fireblocks',
  '/export-private-key',
];

export function App() {
  const preferredColorScheme = usePreferredColorScheme();

  if (!preferredColorScheme) {
    return <CircularProgress />;
  }

  const displayHeader = !pagesWithoutHeader.some((path) =>
    location.pathname.startsWith(path),
  );

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
      {displayHeader && (
        <Stack sx={{ width: 1 }}>
          <Header />
        </Stack>
      )}
      <>Under construction 🚧</>
    </Providers>
  );
}
