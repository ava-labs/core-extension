import {
  Button,
  CircularProgress,
  Fade,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import { FC, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useOnboardingContext } from '@core/ui';

import {
  FullscreenModalActions,
  FullscreenModalContent,
  useModalPageControl,
} from '@/components/FullscreenModal';
import { PersonalAvatar } from '@/components/PersonalAvatar';
import { useOpenApp } from '@/hooks/useOpenApp';

import { useSubmitButton } from '@/hooks/useSubmitButton';
import { LoadingScreen } from '../components/LoadingScreen';

export const EnjoyYourWalletScreen: FC = () => {
  const { t } = useTranslation();
  const { setCurrent, setTotal, setIsBackButtonVisible } =
    useModalPageControl();
  const { submitInProgress, submit } = useOnboardingContext();
  const openApp = useOpenApp();

  useEffect(() => {
    // We don't want to display any page controls on the last screen
    setIsBackButtonVisible(false);
    setCurrent(0);
    setTotal(0);
  }, [setCurrent, setTotal, setIsBackButtonVisible]);

  const openWallet = () => {
    openApp().finally(() => {
      window.close();
    });
  };

  const [openWalletButtonRef, keyboardHandlers] = useSubmitButton();

  useEffect(() => {
    if (!submitInProgress) {
      submit(() => {}); // Do we want to do anything here?
    }
  }, [submit, submitInProgress]);

  return (
    <Stack {...keyboardHandlers} sx={{ px: 11, flexGrow: 1 }}>
      <FullscreenModalContent sx={{ overflow: 'unset', pt: 0 }}>
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            pt: 9,
            pb: 8,
            overflow: 'hidden',
            width: 1,
          }}
        >
          <Suspense fallback={<LoadingScreen />}>
            <PersonalAvatar cached size="large" isGlowing />
          </Suspense>
        </Stack>
        {submitInProgress ? (
          <Stack sx={{ width: 1, pt: 6, alignItems: 'center' }}>
            <CircularProgress size={32} />
          </Stack>
        ) : (
          <Stack sx={{ gap: 3, textAlign: 'center', px: 5 }}>
            <Stack>
              <Typography variant="h2" data-testid="enjoy-wallet-title">
                {t("That's it!")}
              </Typography>
              <Typography variant="h2">{t('Enjoy your wallet')}</Typography>
            </Stack>
            <Typography variant="body1">
              {t(
                'You can now start buying, swapping, sending, receiving crypto and collectibles',
              )}
            </Typography>
          </Stack>
        )}
      </FullscreenModalContent>
      <FullscreenModalActions sx={{ justifyContent: 'center', pb: 6 }}>
        <Fade in={!submitInProgress}>
          <Button
            ref={openWalletButtonRef}
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            onClick={openWallet}
          >
            {t("Let's go!")}
          </Button>
        </Fade>
      </FullscreenModalActions>
    </Stack>
  );
};
