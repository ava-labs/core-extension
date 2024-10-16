import { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react';
import { AccountNameInput } from './AccountNameInput';
import {
  EditIcon,
  Slide,
  Stack,
  toast,
  Typography,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import { useAccountsContext } from '@src/contexts/AccountsProvider';

interface AccountNameProps {
  accountId: string;
  accountName: string;
  cardHovered: boolean;
}

const commonTransitionProps = {
  timeout: 300,
  easing: 'ease-in-out',
  appear: true,
};

export default function AccountName({
  accountName,
  accountId,
  cardHovered,
}: AccountNameProps) {
  const { t } = useTranslation();
  const { renameAccount } = useAccountsContext();

  const [isAccountNameEditing, setIsAccountNameEditing] = useState(false);
  const [newName, setNewName] = useState(accountName);
  const [, setErrorToastId] = useState('');

  const onSave = useCallback(() => {
    console.log('save');
    if (newName === accountName) {
      setIsAccountNameEditing(false);
      return;
    }

    if (newName.trim().length === 0) {
      setErrorToastId((prevToastId) => {
        if (prevToastId) {
          toast.dismiss(prevToastId);
        }
        setIsAccountNameEditing(false);
        return toast.error(t('New name is required'), { duration: 2000 });
      });
      return;
    }

    renameAccount(accountId, newName.trim())
      .then(() => {
        toast.success(t('Account renamed'));
      })
      .catch(() => toast.error(t('Renaming failed')))
      .finally(() => {
        setIsAccountNameEditing(false);
      });
  }, [accountId, accountName, newName, renameAccount, t]);
  return (
    <Stack sx={{ flexDirection: 'row' }}>
      {!isAccountNameEditing && (
        <Typography variant="button">{accountName}</Typography>
      )}
      {isAccountNameEditing && (
        <AccountNameInput
          data-testid="wallet-name-input"
          defaultValue={accountName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setNewName(e.target.value);
          }}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              onSave();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              setIsAccountNameEditing(false);
            }
          }}
          autoFocus
        />
      )}
      {cardHovered && !isAccountNameEditing && (
        <Slide direction="left" {...commonTransitionProps} in>
          <Stack>
            <EditIcon
              size={16}
              sx={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                setIsAccountNameEditing(true);
              }}
            />
          </Stack>
        </Slide>
      )}
    </Stack>
  );
}
