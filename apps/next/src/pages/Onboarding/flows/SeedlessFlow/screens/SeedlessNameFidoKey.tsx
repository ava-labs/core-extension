import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, TextField } from '@avalabs/k2-alpine';

import { useKeyboardShortcuts } from '@core/ui';

import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepDescription,
  OnboardingStepTitle,
} from '@/components/OnboardingModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';

type SeedlessNameFidoKeyProps = {
  keyType: 'passkey' | 'yubikey';
  onNext: (name: string) => void;
};

export const SeedlessNameFidoKey: FC<SeedlessNameFidoKeyProps> = ({
  keyType,
  onNext,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  const keyboardShortcuts = useKeyboardShortcuts({
    Enter: () => onNext(name),
  });

  return (
    <>
      <OnboardingStepTitle>
        {keyType === 'passkey'
          ? t(`Name your Passkey`)
          : t(`Name your Yubikey`)}
      </OnboardingStepTitle>
      <OnboardingStepDescription>
        {t(`Add a name so that it is easier to find later.`)}
      </OnboardingStepDescription>
      <OnboardingStepContent {...keyboardShortcuts}>
        <Stack width="100%" height="100%">
          <TextField
            autoFocus
            fullWidth
            placeholder={t('Enter name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Stack>
      </OnboardingStepContent>
      <OnboardingStepActions>
        <NavButton variant="text" onClick={() => onNext('')}>
          {t(`Skip`)}
        </NavButton>
        <NavButton
          disabled={!name}
          color="primary"
          onClick={() => onNext(name)}
        >
          {t(`Save`)}
        </NavButton>
      </OnboardingStepActions>
    </>
  );
};
