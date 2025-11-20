import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, TextField } from '@avalabs/k2-alpine';

import { useKeyboardShortcuts } from '@core/ui';

import {
  FullscreenModalActions,
  FullscreenModalContent,
  FullscreenModalDescription,
  FullscreenModalTitle,
} from '@/components/FullscreenModal';
import { NavButton } from '@/pages/Onboarding/components/NavButton';

type SeedlessNameFidoKeyProps = {
  keyType: 'passkey' | 'yubikey';
  onNext: (name: string) => void;
  required?: boolean;
};

export const SeedlessNameFidoKey: FC<SeedlessNameFidoKeyProps> = ({
  keyType,
  onNext,
  required,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  const keyboardShortcuts = useKeyboardShortcuts({
    Enter: () => onNext(name),
  });

  return (
    <>
      <FullscreenModalTitle>
        {keyType === 'passkey'
          ? t(`Name your Passkey`)
          : t(`Name your Yubikey`)}
      </FullscreenModalTitle>
      <FullscreenModalDescription>
        {t(`Add a name so that it is easier to find later.`)}
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
      <FullscreenModalActions>
        {!required && (
          <NavButton variant="text" onClick={() => onNext('')}>
            {t(`Skip`)}
          </NavButton>
        )}
        <NavButton
          disabled={!name}
          color="primary"
          onClick={() => onNext(name)}
        >
          {t(`Save`)}
        </NavButton>
      </FullscreenModalActions>
    </>
  );
};
