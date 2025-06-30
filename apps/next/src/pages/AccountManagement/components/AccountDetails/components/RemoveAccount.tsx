import { Stack, Typography } from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdErrorOutline } from 'react-icons/md';
import { useNavigateBack } from '../../NavigateBackContext';
import { ActionButtons } from './ActionButtons';

type Props = {
  account: Account;
  onDelete: () => void;
  onCancel: () => void;
};

export const RemoveAccount: FC<Props> = ({ account, onDelete, onCancel }) => {
  const { t } = useTranslation();
  const { register } = useNavigateBack();

  useEffect(() => register(onCancel), [register, onCancel]);

  return (
    <>
      <Typography variant="h2" pr={2}>
        {t('Are you sure you want to delete {{name}} account?', {
          name: account.name,
        })}
      </Typography>
      <Stack gap={1} direction="row" pr={2} color="error.main">
        <MdErrorOutline size={24} />
        <Typography variant="body1">
          {t('Deleting this account is permanent and cannot be undone')}
        </Typography>
      </Stack>
      <ActionButtons
        top={{
          label: t('Yes, delete'),
          onClick: onDelete,
          color: 'secondary',
          panic: true,
        }}
        bottom={{
          label: t('Cancel'),
          onClick: onCancel,
          color: 'secondary',
        }}
      />
    </>
  );
};
