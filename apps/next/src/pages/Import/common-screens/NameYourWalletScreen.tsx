import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';

import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
  useModalPageControl,
} from '@/components/FullscreenModal';
import { OnboardingScreenProps } from '@/pages/Onboarding/types';
import { NavButton } from '@/pages/Onboarding/components/NavButton';
import { Stack, TextField } from '@avalabs/k2-alpine';
import { useKeyboardShortcuts } from '@core/ui';

type NameYourWalletScreenProps = OnboardingScreenProps & {
  onNext: (name: string) => void;
  isSaving: boolean;
};

export const NameYourWalletScreen: FC<NameYourWalletScreenProps> = ({
  onNext,
  step,
  totalSteps,
  isSaving,
}) => {
  const { t } = useTranslation();
  const { setCurrent, setTotal } = useModalPageControl();
  const [name, setName] = useState('');

  useEffect(() => {
    setCurrent(step);
    setTotal(totalSteps);
  }, [setCurrent, setTotal, step, totalSteps]);

  const keyboardShortcuts = useKeyboardShortcuts({
    Enter: () => onNext(name),
  });

  return (
    <>
      <FullscreenModalTitle>
        {t('Create a name for your wallet')}
      </FullscreenModalTitle>
      <FullscreenModalDescription>
        {t(
          'Wallet names are displayed inside Core and you can change them at any time in the settings.',
        )}
      </FullscreenModalDescription>
      <FullscreenModalContent {...keyboardShortcuts}>
        <Stack width="100%" height="100%">
          <TextField
            autoFocus
            fullWidth
            placeholder={t('Enter name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Stack>
      </FullscreenModalContent>
      <FullscreenModalActions
        sx={{
          gap: 6,
          pt: 2,
        }}
      >
        <NavButton
          color="primary"
          onClick={() => onNext(name)}
          loading={isSaving}
          disabled={isSaving}
        >
          {t('Save')}
        </NavButton>
      </FullscreenModalActions>
    </>
  );
};
