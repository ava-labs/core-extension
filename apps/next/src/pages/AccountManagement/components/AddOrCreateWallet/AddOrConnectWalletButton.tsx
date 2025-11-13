import { Button, Stack } from '@avalabs/k2-alpine';
import { useAccountManager } from '@core/ui';
import { FC } from 'react';
import { MdAdd } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

export const AddOrConnectWalletButton: FC = () => {
  const { t } = useTranslation();
  const { isManageMode } = useAccountManager();
  const { push } = useHistory();

  if (isManageMode) {
    return null;
  }

  return (
    <Stack marginTop={1} alignItems="center" justifyContent="center">
      <Button
        variant="contained"
        color="secondary"
        size="extension"
        onClick={() => push('/account-management/add-wallet')}
      >
        <MdAdd size={20} />
        {t('Add account')}
      </Button>
    </Stack>
  );
};
