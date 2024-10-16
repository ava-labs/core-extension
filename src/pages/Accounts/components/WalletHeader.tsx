import {
  Chip,
  EditIcon,
  LedgerIcon,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';
import { SecretType } from '@src/background/services/secrets/models';
import { WalletDetails } from '@src/background/services/wallet/models';
import { AccountNameInput } from './AccountNameInput';
import { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface WalletHeaderProps {
  walletDetails?: WalletDetails;
  isActive: boolean;
}

export default function WalletHeader({
  walletDetails,
  isActive,
}: WalletHeaderProps) {
  const [isWalletNameEditing, setIsWalletNameEditing] = useState(false);
  const { t } = useTranslation();

  const onSave = useCallback(() => {
    setIsWalletNameEditing(false);
  }, []);
  return (
    <Stack
      sx={{
        gap: 1,
        px: 2,
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      {(walletDetails?.type === SecretType.Ledger ||
        walletDetails?.type == SecretType.LedgerLive) && (
        <LedgerIcon size={13} />
      )}
      {!isWalletNameEditing && (
        <Typography variant="button">{walletDetails?.name}</Typography>
      )}
      {isWalletNameEditing && (
        <AccountNameInput
          data-testid="wallet-name-input"
          defaultValue={walletDetails?.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            console.log('e: ', e);
          }}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            console.log('e: ', e);
            if (e.key === 'Enter') {
              // onSaveClick();
              onSave();
            } else if (e.key === 'Escape') {
              // setNewName(account.name);
              setIsWalletNameEditing(false);
            }
          }}
          autoFocus
        />
      )}
      {isActive && <Chip size="small" color="success" label={t('Active')} />}
      <EditIcon
        size={16}
        sx={{ cursor: 'pointer' }}
        onClick={() => setIsWalletNameEditing(true)}
      />
    </Stack>
  );
}
