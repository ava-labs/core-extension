import { Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

export function Onboarding() {
  const { t } = useTranslation();

  return (
    <Stack
      sx={{
        width: 1,
        height: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h1">{t('😇')}</Typography>
      <Typography variant="h3">{t('Welcome to new Core!')}</Typography>
      <Typography variant="body1">{t('We are excited to see you!')}</Typography>
    </Stack>
  );
}
