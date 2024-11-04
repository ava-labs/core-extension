import {
  Chip,
  ClickAwayListener,
  EditIcon,
  LedgerIcon,
  Slide,
  Stack,
  toast,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { SecretType } from '@src/background/services/secrets/models';
import { WalletDetails } from '@src/background/services/wallet/models';
import { AccountNameInput } from './AccountNameInput';
import { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWalletContext } from '@src/contexts/WalletProvider';

const commonTransitionProps = {
  timeout: 200,
  easing: 'ease-in-out',
  appear: true,
};
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
  const theme = useTheme();
  const { renameWallet } = useWalletContext();
  const [cardHovered, setCardHovered] = useState(false);
  const [, setErrorToastId] = useState('');

  const onSave = useCallback(() => {
    setIsWalletNameEditing(false);

    if (!newWalletName || newWalletName.trim().length === 0) {
      setErrorToastId((prevToastId) => {
        if (prevToastId) {
          toast.dismiss(prevToastId);
        }
        setIsWalletNameEditing(false);
        return toast.error(t('New Wallet Name is Required'), {
          duration: 2000,
        });
      });
      return;
    }
    renameWallet(walletDetails.id, newWalletName.trim())
      .then(() => {
        toast.success(t('Wallet Renamed'));
      })
      .catch(() => {
        toast.error(t('Renaming Failed'));
      })
      .finally(() => {
        setIsWalletNameEditing(false);
      });
  }, [newWalletName, renameWallet, t, walletDetails]);

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      onClickAway={() => setIsWalletNameEditing(false)}
    >
      <Stack
        sx={{
          gap: 1,
          px: 2,
          alignItems: 'center',
          flexDirection: 'row',
        }}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
        onClick={() => setIsWalletNameEditing(true)}
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
            typography="button"
            align="left"
            autoFocus
            sx={{
              boxShadow: `0 0 5px 2px ${theme.palette.grey[500]}`,
              padding: 0.5,
              borderRadius: 1,
              width: 200,
            }}
          />
        )}
        {isActive && !isWalletNameEditing && (
          <Chip size="small" color="success" label={t('Active')} />
        )}
        {(cardHovered || isWalletNameEditing) && (
          <Slide direction="down" {...commonTransitionProps} in>
            <Stack>
              <EditIcon
                size={16}
                sx={{
                  cursor: 'pointer',
                }}
                onClick={() => setIsWalletNameEditing(true)}
              />
            </Stack>
          </Slide>
        )}
      </Stack>
    </ClickAwayListener>
  );
}
