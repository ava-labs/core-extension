import {
  Alert,
  AlertContent,
  Typography,
  useTheme,
  GppMaybeIcon,
} from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';

export function WarningBox() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Alert
      severity="warning"
      icon={<GppMaybeIcon size={24} color={theme.palette.common.black} />}
      sx={{
        backgroundColor: 'warning.light',
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
          {t('Suspicious Application')}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          {t('Use caution, this application may be malicious.')}
        </Typography>
      </AlertContent>
    </Alert>
  );
}
