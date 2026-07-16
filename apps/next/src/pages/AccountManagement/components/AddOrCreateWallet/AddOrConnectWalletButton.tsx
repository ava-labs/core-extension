import AddIcon from '@/components/AddIcon';
import { IconButton } from '@avalabs/k2-alpine';
import { useAccountManager } from '@core/ui';
import { FC } from 'react';
import { useHistory } from 'react-router-dom';

export const AddOrConnectWalletButton: FC = () => {
  const { isManageMode } = useAccountManager();
  const { push } = useHistory();

  if (isManageMode) {
    return null;
  }

  return (
    <IconButton
      size="medium"
      data-testid="add-connect-wallet-button"
      onClick={() => push('/account-management/add-wallet')}
      color="primary"
    >
      <AddIcon />
    </IconButton>
  );
};
