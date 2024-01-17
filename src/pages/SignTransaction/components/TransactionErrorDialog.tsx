import { Typography, Stack, Button } from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';

export const TransactionErrorDialog = ({ onConfirm }) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
        {t(
          'The provided chainID does not match the selected network. Pressing “Continue” will reject the transaction. Please switch networks and try again.'
        )}
      </Typography>
      <Stack
        sx={{
          mt: 3,
        }}
      >
        <Button
          sx={{ mb: 1 }}
          onClick={() => {
            onConfirm();
          }}
        >
          {t('Continue')}
        </Button>
      </Stack>
    </>
  );
};
