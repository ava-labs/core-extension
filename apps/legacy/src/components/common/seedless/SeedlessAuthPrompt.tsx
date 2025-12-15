import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@avalabs/core-k2-components';

import { useDeriveMissingKeysForSeedless, useWalletContext } from '@core/ui';
import { openExtensionNewWindow } from '@core/common';
import { useSeedlessAuthPromptState } from '@core/ui';
import { SecretType } from '@core/types';
import { useMissingKeysDerivationCallbacks } from './hooks/useMissingKeysDerivationCallbacks';

export const SeedlessAuthPrompt = () => {
  const { t } = useTranslation();
  const { walletDetails } = useWalletContext();
  const { isAuthPromptVisible } = useSeedlessAuthPromptState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const derivationCallbacks = useMissingKeysDerivationCallbacks();
  useDeriveMissingKeysForSeedless(derivationCallbacks);

  const handleLogin = useCallback(async () => {
    const popup = await openExtensionNewWindow('seedless-auth');

    if (popup.state) {
      setIsPopupOpen(true);

      const subscription = popup.removed.subscribe(() => {
        setIsPopupOpen(false);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Make sure not to render the prompt if it comes for the wrong wallet by mistake somehow.
  if (walletDetails?.type !== SecretType.Seedless) {
    return null;
  }

  return (
    <Dialog
      open={isAuthPromptVisible}
      PaperProps={{
        sx: { m: 2 },
      }}
      sx={{ textAlign: 'center' }}
    >
      <DialogTitle>
        <Typography variant="h5">{t("You've Been Logged Out")}</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          {t(
            'For security reasons your session has timed out. Please log in again.',
          )}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          key="seedlessAuthPrompedLoginButton"
          onClick={handleLogin}
          color="primary"
          size="large"
          fullWidth
          isLoading={isPopupOpen}
          disabled={isPopupOpen}
        >
          {t('Login')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
