import { FC, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  CircularProgress,
  Fade,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import { action } from 'webextension-polyfill';

import { useKeyboardShortcuts, useOnboardingContext } from '@core/ui';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  useModalPageControl,
} from '@/components/OnboardingModal';
import { AVATAR_OPTIONS, PersonalAvatar } from '@/components/PersonalAvatar';

export const EnjoyYourWalletScreen: FC = () => {
  const { t } = useTranslation();
  const { setCurrent, setTotal, setIsBackButtonVisible } =
    useModalPageControl();
  const {
    avatar: avatarDataUri,
    submitInProgress,
    submit,
  } = useOnboardingContext();

  useEffect(() => {
    // We don't want to display any page controls on the last screen
    setIsBackButtonVisible(false);
    setCurrent(0);
    setTotal(0);
  }, [setCurrent, setTotal, setIsBackButtonVisible]);

  const openWallet = () => {
    action.openPopup();
    window.close();
  };

  const keyboardHandlers = useKeyboardShortcuts({
    Enter: openWallet,
  });

  // If for whatever reason we did not save the avatar, use a fallback
  const avatarProps = avatarDataUri
    ? { dataUri: avatarDataUri }
    : { name: AVATAR_OPTIONS[0] };

  useEffect(() => {
    if (!submitInProgress) {
      submit(() => {}); // Do we want to do anything here?
    }
  }, [submit, submitInProgress]);

  return (
    <Stack {...keyboardHandlers} sx={{ px: 15, flexGrow: 1 }}>
      <OnboardingStepContent sx={{ overflow: 'unset', pt: 0 }}>
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
          <Suspense
            fallback={
              <Stack
                sx={{
                  width: 1,
                  height: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CircularProgress />
              </Stack>
            }
          >
            <PersonalAvatar {...avatarProps} size="large" isGlowing />
          </Suspense>
        </Stack>
        {submitInProgress ? (
          <Stack sx={{ width: 1, pt: 6, alignItems: 'center' }}>
            <CircularProgress size={60} />
          </Stack>
        ) : (
          <Stack sx={{ gap: 3, textAlign: 'center' }}>
            <Stack>
              <Typography variant="h2">{t("That's it!")}</Typography>
              <Typography variant="h2">{t('Enjoy your wallet')}</Typography>
            </Stack>
            <Typography variant="body1">
              {t(
                'You can now start buying, swapping, sending, receiving crypto and collectibles with no added fees',
              )}
            </Typography>
          </Stack>
        )}
      </OnboardingStepContent>
      <OnboardingStepActions sx={{ justifyContent: 'center' }}>
        <Fade in={!submitInProgress}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            onClick={openWallet}
          >
            {t('Open wallet')}
          </Button>
        </Fade>
      </OnboardingStepActions>
    </Stack>
  );
};
