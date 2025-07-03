import { FC, useState } from 'react';
import { Button, ButtonProps } from '@avalabs/k2-alpine';

import { SeedlessAuthProvider } from '@core/types';
import { useOnboardingContext, useSeedlessActions } from '@core/ui';
import { authenticateWithApple, authenticateWithGoogle } from '@core/common';

import { SEEDLESS_ACTIONS_OPTIONS } from '../config';

type SeedlessSignInButtonProps = Omit<ButtonProps, 'loading' | 'onClick'> & {
  provider: SeedlessAuthProvider;
};

type OidcTokenFetcher = () => Promise<string>;

const OIDC_STRATEGY: Record<SeedlessAuthProvider, OidcTokenFetcher> = {
  [SeedlessAuthProvider.Google]: authenticateWithGoogle,
  [SeedlessAuthProvider.Apple]: authenticateWithApple,
};

export const SeedlessSignInButton: FC<SeedlessSignInButtonProps> = ({
  provider,
  ...buttonProps
}) => {
  const { setAuthProvider } = useOnboardingContext();
  const { signIn } = useSeedlessActions(SEEDLESS_ACTIONS_OPTIONS);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      fullWidth
      data-testid={`create-wallet-${provider}-button`}
      color="primary"
      variant="contained"
      size="large"
      onClick={() => {
        setAuthProvider(provider);
        signIn({
          setIsLoading,
          getOidcToken: OIDC_STRATEGY[provider],
          provider,
        });
      }}
      loading={isLoading}
      {...buttonProps}
    />
  );
};
