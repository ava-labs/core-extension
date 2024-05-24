import {
  Button,
  Dialog,
  Stack,
  Typography,
  useTheme,
  RemoveModeratorIcon,
} from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';

export function AlertDialog({ cancelHandler, open, onClose }) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      showCloseIcon
      onClose={onClose}
      PaperProps={{
        sx: {
          m: 2,
          width: 1,
          height: 1,
          maxWidth: 'none',
          position: 'relative',
        },
      }}
    >
      <Stack
        sx={{
          py: 3,
          px: 5,
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            width: '225px',
            gap: 1.5,
            py: 15,
          }}
        >
          <RemoveModeratorIcon
            size={48}
            color={theme.customPalette.avalancheRed}
          />
          <Typography
            sx={{ color: theme.customPalette.avalancheRed, px: 2 }}
            variant="h4"
          >
            {t('Scam Application')}
          </Typography>
          <Typography variant="body2">
            {t('This application is malicious, do not proceed.')}
          </Typography>
        </Stack>
        <Stack
          sx={{
            alignItems: 'center',
            width: '100%',
            gap: 1,
          }}
        >
          <Button
            color="primary"
            data-testid="connect-reject-btn"
            onClick={() => {
              cancelHandler();
              window.close();
            }}
            fullWidth
            size="large"
          >
            {t('Reject Connection')}
          </Button>
          <Button
            data-testid="connect-approve-btn"
            onClick={onClose}
            fullWidth
            size="large"
            color="secondary"
          >
            {t('Proceed Anyway')}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
