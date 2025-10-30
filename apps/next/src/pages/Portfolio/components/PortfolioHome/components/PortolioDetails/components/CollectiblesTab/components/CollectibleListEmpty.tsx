import { Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

export function CollectibleListEmpty() {
  const { t } = useTranslation();

  return (
    <Stack
      sx={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
      }}
    >
      <Typography
        variant="h1"
        component="span"
        sx={{ mb: 2, fontWeight: 'medium' }}
      >
        🌵
      </Typography>
      <Typography variant="body3" sx={{ fontWeight: 600 }}>
        {t('No collectibles')}
      </Typography>
    </Stack>
  );
}
