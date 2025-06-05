import { CircularProgress, toast } from '@avalabs/k2-alpine';
import {
  AccountsContextProvider,
  NetworkContextProvider,
  OnboardingContextProvider,
} from '@core/ui';

import { Onboarding } from '@/pages/Onboarding';

export function App() {
  return (
    <AccountsContextProvider>
      <NetworkContextProvider>
        <OnboardingContextProvider
          onError={(message: string) => toast.error(message)}
          LoadingComponent={CircularProgress}
          OnboardingScreen={Onboarding}
        >
          <></>
        </OnboardingContextProvider>
      </NetworkContextProvider>
    </AccountsContextProvider>
  );
}
