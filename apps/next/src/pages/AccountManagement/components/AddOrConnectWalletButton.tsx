import { Box, Button } from '@avalabs/k2-alpine';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const AddOrConnectWalletButton: FC = () => {
  const { t } = useTranslation();

  return (
    <Box position="fixed" bottom={0} left={0} right={0} p={1.5}>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => alert('Under development')}
      >
        {t('Add or connect a wallet')}
      </Button>
    </Box>
  );
};

export default AddOrConnectWalletButton;
