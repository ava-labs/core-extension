import { Select } from '@/components/Select';
import { PasswordField } from '@/components/StandaloneField';
import {
  Button,
  MenuItem,
  Stack,
  styled,
  Typography,
} from '@avalabs/k2-alpine';
import { Account, AccountType, PrivateKeyChain, SecretType } from '@core/types';
import { useKeyboardShortcuts } from '@core/ui';
import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRevealKey } from '../hooks/useRevealKey';

type Props = {
  account: Extract<
    Account,
    { type: AccountType.IMPORTED | AccountType.PRIMARY }
  >;
  onAuthenticated(key: string | null): void;
};

const LessRoundedPasswordField = styled(PasswordField)(({ theme }) => ({
  '& .MuiFilledInput-root': {
    borderRadius: theme.shape.borderRadius,
  },
}));

export const EnterPassword: FC<Props> = ({ account, onAuthenticated }) => {
  const { t } = useTranslation();
  const [chain, setChain] = useState<PrivateKeyChain>(PrivateKeyChain.C);
  const revealButtonRef = useRef<HTMLButtonElement>(null);
  const [password, setPassword] = useState('');
  const { revealKey, error, isLoading } = useRevealKey();

  const id = account.id;
  const index = account.type === AccountType.IMPORTED ? 0 : account.index;
  const type =
    account.type === AccountType.IMPORTED
      ? AccountType.IMPORTED
      : SecretType.Mnemonic;

  const shortcuts = useKeyboardShortcuts({
    Enter: () => revealButtonRef.current?.click(),
  });

  return (
    <Stack height={1} gap={2}>
      <Typography variant="h2" paddingInlineEnd={7} paddingBlockEnd={3}>
        {t('Enter your password to reveal the private key')}
      </Typography>

      <Select
        label={t('Chain')}
        value={chain}
        onChange={(e) => setChain(e.target.value as PrivateKeyChain)}
      >
        <MenuItem value={PrivateKeyChain.C}>{t('Avalanche C-Chain')}</MenuItem>
        <MenuItem value={PrivateKeyChain.XP}>
          {t('Avalanche X/P-Chain')}
        </MenuItem>
      </Select>

      <LessRoundedPasswordField
        value={password}
        placeholder={t('Enter password')}
        onChange={(e) => setPassword(e.target.value)}
        error={!!error}
        helperText={error}
        {...shortcuts}
      />

      <Button
        ref={revealButtonRef}
        variant="contained"
        color="primary"
        size="small"
        fullWidth
        loading={isLoading}
        disabled={!password || isLoading}
        onClick={() =>
          revealKey(password, chain, type, index, id).then(onAuthenticated)
        }
      >
        {t('Reveal')}
      </Button>
    </Stack>
  );
};
