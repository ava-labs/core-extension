import { Stack } from '@avalabs/k2-alpine';
import { FC, Suspense, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useKeyboardShortcuts } from '@core/ui';

import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
  useModalPageControl,
} from '@/components/FullscreenModal';
import {
  AVATAR_OPTIONS,
  PersonalAvatar,
  usePersonalAvatar,
  type PersonalAvatarName,
} from '@/components/PersonalAvatar';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';

import { LoadingScreen } from '../components/LoadingScreen';
import { NavButton } from '../components/NavButton';
import { AvatarGrid } from './SelectAvatarScreen/components/AvatarGrid';

type SelectAvatarScreenProps = OnboardingScreenProps & {
  onNext: () => void;
};

export const SelectAvatarScreen: FC<SelectAvatarScreenProps> = ({
  step,
  totalSteps,
  onNext,
}) => {
  const { t } = useTranslation();
  const { setCurrent, setTotal } = useModalPageControl();
  const { saveAvatar } = usePersonalAvatar();
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
    await saveAvatar(selectedAvatar);
    onNext();
  }, [onNext, selectedAvatar, saveAvatar]);

  const keyboardHandlers = useKeyboardShortcuts({
    Enter: handleNextClick,
  });

  return (
    <>
      <FullscreenModalTitle>
        {t('Select your personal avatar')}
      </FullscreenModalTitle>
      <FullscreenModalDescription>
        {t(
          'A few more details are needed before getting any further with your wallet creation',
        )}
      </FullscreenModalDescription>
      <FullscreenModalContent
        sx={{ overflow: 'unset', pt: 0 }}
        {...keyboardHandlers}
      >
        <Stack alignItems="center">
          <Suspense fallback={<LoadingScreen />}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              flexGrow={1}
              pt={6}
              pb={2}
            >
              <PersonalAvatar name={selectedAvatar} size="large" isGlowing />
            </Stack>
            <AvatarGrid
              sx={{
                height: '250px',
                alignSelf: 'center',
                width: 'fit-content',
                maxWidth: '100%',
              }}
              avatars={AVATAR_OPTIONS}
              selected={selectedAvatar as PersonalAvatarName}
              onSelect={(a) => setSelectedAvatar(a)}
            />
          </Suspense>
        </Stack>
      </FullscreenModalContent>
      <FullscreenModalActions>
        <NavButton color="primary" onClick={handleNextClick}>
          {t('Next')}
        </NavButton>
      </FullscreenModalActions>
    </>
  );
};
