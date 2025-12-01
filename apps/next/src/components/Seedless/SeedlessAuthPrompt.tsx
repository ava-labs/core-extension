import { Button, DialogActions, Typography } from '@avalabs/k2-alpine';
import { openExtensionNewWindow } from '@core/common';
import { SecretType } from '@core/types';
import {
  useDeriveMissingKeysForSeedless,
  useSeedlessAuthPromptState,
  useWalletContext,
} from '@core/ui';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SlideUpDialog } from '@/components/Dialog';
import { PageTopBar } from '../PageTopBar';
import {
  StyledBox,
  StyledCoreIcon,
  StyledDialogContent,
  StyledStack,
  StyledWarningIcon,
} from './styled';

export const SeedlessAuthPrompt = () => {
  const { t } = useTranslation();
  const { walletDetails } = useWalletContext();
  const { isAuthPromptVisible } = useSeedlessAuthPromptState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useDeriveMissingKeysForSeedless();

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
    <SlideUpDialog open={isAuthPromptVisible}>
      <PageTopBar />
      <StyledDialogContent>
        <StyledStack>
          <StyledBox>
            <StyledCoreIcon />
            <StyledWarningIcon>⚠️</StyledWarningIcon>
          </StyledBox>
          <Typography variant="h2" textAlign="center">
            {t('Your session has timed out')}
          </Typography>

          <Typography variant="subtitle2" textAlign="center">
            {t('You have been logged out do to inactivity')}
          </Typography>
        </StyledStack>
      </StyledDialogContent>
      <DialogActions>
        <Button
          key="seedlessAuthPrompedLoginButton"
          onClick={handleLogin}
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          loading={isPopupOpen}
          disabled={isPopupOpen}
        >
          {t('Login')}
        </Button>
      </DialogActions>
    </SlideUpDialog>
  );
};
