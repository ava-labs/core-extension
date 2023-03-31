import { Stack, Typography, Dialog, Button } from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';
import InvalidQRCodeIcon from '../icons/InvalidQRCodeIcon';

export const InvalidQRCodeDialog = ({ onRetry }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open
      showCloseIcon={false}
      fullWidth
      maxWidth={false}
      sx={{ textAlign: 'center' }}
      PaperProps={{
        sx: { m: 2, width: '100%', maxWidth: 'none' },
      }}
    >
      <Stack
        sx={{
          alignItems: 'center',
          height: '100%',
          justifyContent: 'center',
          gap: 3,
          py: 3,
          px: 2,
        }}
      >
        <Typography variant="h4">{t('Invalid QR Code')}</Typography>
        <Stack sx={{ alignItems: 'center', gap: 3 }}>
          <Typography variant="body1">
            {t(
              `Please ensure you have selected a valid QR code from your Keystone device`
            )}
          </Typography>
          <InvalidQRCodeIcon />
        </Stack>
        <Stack sx={{ gap: 2, width: '100%' }}>
          <Button color="primary" size="medium" fullWidth onClick={onRetry}>
            {t('Retry')}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};
