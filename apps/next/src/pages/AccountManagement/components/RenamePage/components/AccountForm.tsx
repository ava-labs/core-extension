import { toast } from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { useAccountsContext } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { RenameForm } from './Form';

type Props = {
  account: Account;
};

export const RenameAccountForm: FC<Props> = ({ account }) => {
  const { t } = useTranslation();
  const { goBack } = useHistory();
  const { renameAccount } = useAccountsContext();

  const onSave = (newName: string) => {
    renameAccount(account.id, newName)
      .then(() => {
        goBack();
        toast.success(t('Account renamed'));
      })
      .catch(() => {
        toast.error(t('Failed to rename the account. Try again.'));
      });
  };

  return <RenameForm name={account.name} onSave={onSave} onCancel={goBack} />;
};
