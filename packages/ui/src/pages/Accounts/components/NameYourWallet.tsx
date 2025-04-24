import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Stack,
  TextField,
  useTheme,
} from '@avalabs/core-k2-components';

import { PageTitle } from 'packages/ui/src/components/common/PageTitle';
import { useKeyboardShortcuts } from '@src/hooks/useKeyboardShortcuts';

type NameYourWalletProps = {
  isImporting: boolean;
  onSave: (name?: string) => void;
  onBackClick: () => void;
  backgroundColor?: string;
};

export function NameYourWallet({
  isImporting,
  onSave,
  onBackClick,
  backgroundColor,
}: NameYourWalletProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const [name, setName] = useState('');

  const handleSave = useCallback(() => {
    onSave(name);
  }, [name, onSave]);

  const keyboardShortcuts = useKeyboardShortcuts({
    Enter: handleSave,
    Escape: onBackClick,
  });

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        background: backgroundColor ?? theme.palette.background.paper,
      }}
    >
      <Stack direction="row" sx={{ mt: 2.5, mb: 0.5, pr: 1 }}>
        <PageTitle onBackClick={onBackClick}>{t('Name your Wallet')}</PageTitle>
      </Stack>

      <Stack sx={{ px: 2, pt: 1, flexGrow: 1, gap: 3 }}>
        <TextField
          autoFocus
          data-testid="wallet-name-input"
          fullWidth
          label={t('Wallet Name')}
          inputLabelProps={{
            sx: { transform: 'none', fontSize: 'body2.fontSize', mb: 1 },
          }}
          onChange={(ev) => setName(ev.target.value)}
          value={name}
          placeholder={t('My New Wallet')}
          {...keyboardShortcuts}
        />
      </Stack>

      <Stack sx={{ py: 3, px: 2, gap: 1, width: 1 }}>
        <Button
          fullWidth
          disabled={!name || isImporting}
          isLoading={isImporting}
          size="large"
          data-testid="save-wallet-name"
          onClick={handleSave}
        >
          {t('Save')}
        </Button>
        <Button
          variant="text"
          fullWidth
          disabled={isImporting}
          size="large"
          data-testid="skip-wallet-name"
          onClick={() => onSave()}
        >
          {t('Skip')}
        </Button>
      </Stack>
    </Stack>
  );
}
