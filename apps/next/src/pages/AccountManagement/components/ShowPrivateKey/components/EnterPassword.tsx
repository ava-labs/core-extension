import { Select } from '@/components/Select';
import { LessRoundedPasswordField } from '@/components/StandaloneField';
import { useSubmitButton } from '@/hooks/useSubmitButton';
import {
  Button,
  MenuItem,
  Stack,
  styled,
  selectClasses,
} from '@avalabs/k2-alpine';
import { Account, AccountType, PrivateKeyChain, SecretType } from '@core/types';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRevealKey } from '../hooks/useRevealKey';

type Props = {
  account: Extract<
    Account,
    { type: AccountType.IMPORTED | AccountType.PRIMARY }
  >;
  onAuthenticated(key: string | null): void;
};

const StyledSelect = styled(Select)(({ theme }) => ({
  [`&.${selectClasses.root}`]: {
    borderRadius: theme.shape.mediumBorderRadius,
  },
}));

export const EnterPassword: FC<Props> = ({ account, onAuthenticated }) => {
  const { t } = useTranslation();
  const [chain, setChain] = useState<PrivateKeyChain>(PrivateKeyChain.C);
  const [revealButtonRef, shortcuts] = useSubmitButton();
  const [password, setPassword] = useState('');
  const { revealKey, error, isLoading } = useRevealKey();

  const id = account.id;
  const index = account.type === AccountType.IMPORTED ? 0 : account.index;
  const type =
    account.type === AccountType.IMPORTED
      ? AccountType.IMPORTED
      : SecretType.Mnemonic;

  return (
    <Stack height={1} gap={1.5}>
      <StyledSelect
        label={t('Chain')}
        value={chain}
        onChange={(e) => setChain(e.target.value as PrivateKeyChain)}
      >
        <MenuItem value={PrivateKeyChain.C}>{t('Avalanche C-Chain')}</MenuItem>
        <MenuItem value={PrivateKeyChain.XP}>
          {t('Avalanche X/P-Chain')}
        </MenuItem>
      </StyledSelect>

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
        size="extension"
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
