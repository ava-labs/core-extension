import { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react';
import { AccountNameInput } from './AccountNameInput';
import {
  ClickAwayListener,
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
  isActive?: boolean;
}

const commonTransitionProps = {
  timeout: 200,
  easing: 'ease-in-out',
  appear: true,
};

export default function AccountName({
  accountName,
  accountId,
  cardHovered,
  isActive,
}: AccountNameProps) {
  const { t } = useTranslation();
  const { renameAccount } = useAccountsContext();

  const [isAccountNameEditing, setIsAccountNameEditing] = useState(false);
  const [newName, setNewName] = useState(accountName);
  const [, setErrorToastId] = useState('');

  const onSave = useCallback(() => {
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
    <ClickAwayListener
      mouseEvent="onMouseDown"
      onClickAway={() => setIsAccountNameEditing(false)}
    >
      <Stack sx={{ flexDirection: 'row', alignItems: 'center' }}>
        {!isAccountNameEditing && (
          <Typography data-testid="account-name" variant="h6">
            {accountName}
          </Typography>
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
            onClick={(e) => e.stopPropagation()}
            typography="h6"
            align="left"
            autoFocus
            isActive={isActive}
          />
        )}
        {cardHovered && !isAccountNameEditing && (
          <Slide direction="down" {...commonTransitionProps} in>
            <Stack>
              <EditIcon
                size={16}
                sx={{
                  cursor: 'pointer',
                  ml: 1,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAccountNameEditing(true);
                }}
              />
            </Stack>
          </Slide>
        )}
      </Stack>
    </ClickAwayListener>
  );
}
