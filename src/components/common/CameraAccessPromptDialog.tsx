import {
  Stack,
  Typography,
  Dialog,
  Button,
  ExternalLinkIcon,
  CircularProgress,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

export const CameraAccessPromptDialog = ({ QRScanner }) => {
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
        <Typography variant="h4">{t('Camera Access')}</Typography>
        <Stack sx={{ alignItems: 'center', gap: 3 }}>
          <Typography variant="body1">
            {t(`Allow Chrome access to your camera to scan the QR Code`)}
          </Typography>
          <CircularProgress size={64} sx={{ my: 6 }} />
          <QRScanner />
          <Typography variant="body2" color="text.secondary">
            {t(
              'If you block access, look in the top right corner of your browser to enable camera access',
            )}
          </Typography>
        </Stack>
        <Stack sx={{ gap: 2, width: '100%' }}>
          <Button fullWidth size="medium">
            {t('Close')}
          </Button>
          <Button
            variant="text"
            onClick={() => {
              window.open('https://keyst.one', '_blank', 'noreferrer');
            }}
          >
            <ExternalLinkIcon
              size={16}
              sx={{ color: 'secondary.main', marginRight: 1 }}
            />
            <Typography
              variant="caption"
              sx={{
                color: 'secondary.main',
                fontWeight: 600,
              }}
            >
              {t('Keystone Support')}
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};
