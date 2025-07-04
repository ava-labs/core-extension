import { Box, Button } from '@avalabs/k2-alpine';
import { useAccountManager } from '@core/ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const AddOrConnectWalletButton: FC = () => {
  const { t } = useTranslation();
  const { isManageMode } = useAccountManager();

  if (isManageMode) {
    return null;
  }

  return (
    <Box marginTop="auto">
      <Button
        variant="contained"
        color="primary"
        size="small"
        fullWidth
        onClick={() => alert('Under development')}
      >
        {t('Add or connect a wallet')}
      </Button>
    </Box>
  );
};

export default AddOrConnectWalletButton;
