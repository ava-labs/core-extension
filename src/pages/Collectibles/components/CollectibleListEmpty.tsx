import { Typography, Stack } from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';

export function CollectibleListEmpty() {
  const { t } = useTranslation();
  return (
    <Stack
      sx={{
        alignItems: 'center',
        flexGrow: '1',
        rowGap: 1,
        mt: 7,
      }}
    >
      <Typography variant="h5">{t('No Collectibles')}</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {t('You don’t have any NFTs yet!')}
      </Typography>
    </Stack>
  );
}
