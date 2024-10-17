import {
  Chip,
  EditIcon,
  LedgerIcon,
  Stack,
  toast,
  Typography,
} from '@avalabs/core-k2-components';
import { SecretType } from '@src/background/services/secrets/models';
import { WalletDetails } from '@src/background/services/wallet/models';
import { AccountNameInput } from './AccountNameInput';
import { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWalletContext } from '@src/contexts/WalletProvider';

interface WalletHeaderProps {
  walletDetails: WalletDetails;
  isActive: boolean;
}

export default function WalletHeader({
  walletDetails,
  isActive,
}: WalletHeaderProps) {
  const [isWalletNameEditing, setIsWalletNameEditing] = useState(false);
  const [newWalletName, setNewWalletName] = useState(walletDetails?.name);
  const { t } = useTranslation();
  const { renameWallet } = useWalletContext();

  const onSave = useCallback(() => {
    setIsWalletNameEditing(false);
    if (!newWalletName) {
      return;
    }
    renameWallet(walletDetails.id, newWalletName.trim())
      .then(() => {
        toast.success(t('Wallet renamed'));
      })
      .catch((e) => {
        console.error(e);
        toast.error(t('Renaming failed'));
      })
      .finally(() => {
        setIsWalletNameEditing(false);
      });
  }, [newWalletName, renameWallet, t, walletDetails]);

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
            setNewWalletName(e.target.value);
          }}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              onSave();
            } else if (e.key === 'Escape') {
              e.preventDefault();
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
