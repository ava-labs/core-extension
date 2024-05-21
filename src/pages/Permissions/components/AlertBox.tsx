import {
  Alert,
  AlertContent,
  Typography,
  useTheme,
  RemoveModeratorIcon,
} from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';

export function AlertBox() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Alert
      severity="error"
      icon={
        <RemoveModeratorIcon size={24} color={theme.palette.common.black} />
      }
      sx={{
        backgroundColor: 'error.light',
        borderColor: 'transparent',
        px: 2,
        color: 'common.black',
        width: '100%',
      }}
    >
      <AlertContent>
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, display: 'block' }}
        >
          {t('Malicious Application')}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          {t('This application is malicious, do not proceed.')}
        </Typography>
      </AlertContent>
    </Alert>
  );
}
