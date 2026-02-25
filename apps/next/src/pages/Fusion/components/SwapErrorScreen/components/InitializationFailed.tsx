import { FiAlertCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@avalabs/k2-alpine';

export const InitializationFailed = () => {
  const { t } = useTranslation();

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      gap={4}
      px={4}
      textAlign="center"
      color="error.main"
    >
      <FiAlertCircle size={40} />
      <Stack gap={2}>
        <Typography variant="subtitle3">
          {t('Swap feature is temporarily unavailable')}
        </Typography>
        <Stack gap={0.5}>
          <Typography variant="body3" color="text.secondary">
            {t('Our team is aware of this issue and is working to resolve it.')}
          </Typography>
          <Typography variant="body3" color="text.secondary">
            {t('Please try again later.')}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
