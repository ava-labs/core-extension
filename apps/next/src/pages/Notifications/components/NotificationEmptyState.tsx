import { Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

export const NotificationEmptyState = () => {
  const { t } = useTranslation();

  return (
    <Stack alignItems="center" justifyContent="center" flexGrow={1} py={8}>
      <Typography sx={{ fontSize: 48, lineHeight: '60px', mb: 2 }}>
        🙌
      </Typography>
      <Typography variant="h4" mb={1}>
        {t('No notifications')}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {t("You're all caught up")}
      </Typography>
    </Stack>
  );
};
