import { useTranslation } from 'react-i18next';
import { FC, Suspense, useCallback, useEffect, useState } from 'react';
import { Stack } from '@avalabs/k2-alpine';

import { useKeyboardShortcuts } from '@core/ui';

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
import { OnboardingScreenProps } from '@/pages/Onboarding/types';

import { AvatarGrid } from './SelectAvatarScreen/components/AvatarGrid';
import { LoadingScreen } from '../components/LoadingScreen';
import { NavButton } from '../components/NavButton';

type SelectAvatarScreenProps = OnboardingScreenProps & {
  onNext: (avatarUri: string) => void;
};

export const SelectAvatarScreen: FC<SelectAvatarScreenProps> = ({
  step,
  totalSteps,
  onNext,
}) => {
  const { t } = useTranslation();
  const { setCurrent, setTotal } = useModalPageControl();

  const [selectedAvatar, setSelectedAvatar] = useState<PersonalAvatarName>(
    AVATAR_OPTIONS[0],
  );

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, totalSteps, step]);

  const handleNextClick = useCallback(async () => {
    // Save avatar data URI. This way even if we accidentally remove or rename the image
    // in the repo, user won't lose their avatar.
    onNext(await getAvatarDataUri(selectedAvatar));
  }, [onNext, selectedAvatar]);

  const keyboardHandlers = useKeyboardShortcuts({
    Enter: handleNextClick,
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
          <Suspense fallback={<LoadingScreen />}>
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
        <NavButton color="primary" onClick={handleNextClick}>
          {t('Next')}
        </NavButton>
      </OnboardingStepActions>
    </>
  );
};
