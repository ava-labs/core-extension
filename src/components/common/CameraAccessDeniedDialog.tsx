import { Stack, Typography, Dialog, Button } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';
import CameraBlockedIcon from '../icons/CameraAccessDeniedIcon';

export const CameraAccessDeniedDialog = ({ refreshPermissions }) => {
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
        <Typography variant="h4">{t('Access Blocked')}</Typography>
        <Stack sx={{ alignItems: 'center', gap: 3 }}>
          <Typography variant="body1">
            {t(
              `You've blocked access to your camera. Please allow access to continue.`,
            )}
          </Typography>
          <CameraBlockedIcon />
          <Typography variant="body2" color="text.secondary">
            {t(
              'If you block access, look in the top right corner of your browser to enable camera access',
            )}
          </Typography>
        </Stack>
        <Stack sx={{ gap: 2, width: '100%' }}>
          <Button
            color="primary"
            size="medium"
            fullWidth
            onClick={refreshPermissions}
          >
            {t('Done')}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};
