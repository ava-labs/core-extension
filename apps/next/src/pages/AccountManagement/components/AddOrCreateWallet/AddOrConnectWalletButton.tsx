import { Box, Button } from '@avalabs/k2-alpine';
import { useAccountManager } from '@core/ui';
import { FC } from 'react';
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
    <Box marginTop="auto">
      <Button
        variant="contained"
        color="primary"
        size="extension"
        fullWidth
        onClick={() => push('/account-management/add-wallet')}
      >
        {t('Add an account or connect a wallet')}
      </Button>
    </Box>
  );
};
