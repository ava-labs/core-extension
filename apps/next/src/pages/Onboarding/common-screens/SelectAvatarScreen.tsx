import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FC, Suspense, useCallback, useEffect, useState } from 'react';
import { Button, CircularProgress, Stack } from '@avalabs/k2-alpine';

import { useKeyboardShortcuts, useOnboardingContext } from '@core/ui';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
  useModalPageControl,
} from '@/components/OnboardingModal';
import {
  AVATAR_OPTIONS,
  getAvatarDataUri,
  PersonalAvatar,
  type PersonalAvatarName,
} from '@/components/PersonalAvatar';

import { AvatarGrid } from './SelectAvatarScreen/components/AvatarGrid';

type SelectAvatarScreenProps = {
  step: number;
  totalSteps: number;
};

export const SelectAvatarScreen: FC<SelectAvatarScreenProps> = ({
  step,
  totalSteps,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { setCurrent, setTotal } = useModalPageControl();
  const { setAvatar } = useOnboardingContext();

  const [selectedAvatar, setSelectedAvatar] = useState<PersonalAvatarName>(
    AVATAR_OPTIONS[0],
  );

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, totalSteps, step]);

  const onNext = useCallback(async () => {
    // Save avatar data URI. This way even if we accidentally remove or rename the image
    // in the repo, user won't lose their avatar.
    setAvatar(await getAvatarDataUri(selectedAvatar));
    history.push(`/onboarding/import/recovery-phrase/enjoy-your-wallet`);
  }, [history, setAvatar, selectedAvatar]);

  const keyboardHandlers = useKeyboardShortcuts({
    Enter: onNext,
  });

  return (
    <>
      <OnboardingStepTitle>
        {t('Select your personal avatar')}
      </OnboardingStepTitle>
      <OnboardingStepDescription>
        {t(
          'A few more details are needed before getting any further with your wallet creation',
        )}
      </OnboardingStepDescription>
      <OnboardingStepContent
        sx={{ overflow: 'unset', pt: 0 }}
        {...keyboardHandlers}
      >
        <Stack>
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
            <Stack
              sx={{
                flexDirection: 'row',
                justifyContent: 'center',
                flexGrow: 1,
                alignItems: 'center',
                pt: 6,
                pb: 2,
                overflow: 'hidden',
              }}
            >
              <PersonalAvatar name={selectedAvatar} size="large" isGlowing />
            </Stack>
            <AvatarGrid
              sx={{ height: '250px' }}
              avatars={AVATAR_OPTIONS}
              selected={selectedAvatar as PersonalAvatarName}
              onSelect={(a) => setSelectedAvatar(a)}
            />
          </Suspense>
        </Stack>
      </OnboardingStepContent>
      <OnboardingStepActions>
        <Button variant="contained" color="primary" onClick={onNext}>
          {t('Next')}
        </Button>
      </OnboardingStepActions>
    </>
  );
};
