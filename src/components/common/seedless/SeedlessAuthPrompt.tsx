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

import { useWalletContext } from '@src/contexts/WalletProvider';
import { openExtensionNewWindow } from '@src/utils/extensionUtils';
import { useSeedlessAuthPromptState } from '@src/hooks/useSeedlessAuthPromptState';
import { SecretType } from 'packages/service-worker/src/services/secrets/models';

export const SeedlessAuthPrompt = () => {
  const { t } = useTranslation();
  const { walletDetails } = useWalletContext();
  const { isAuthPromptVisible } = useSeedlessAuthPromptState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
