import { Typography, Stack } from '@avalabs/k2-components';
import { useTranslation } from 'react-i18next';

export function CollectibleListEmpty() {
  const { t } = useTranslation();
  return (
    <Stack
      sx={{
        direction: 'column',
        alignContent: 'center',
        flexGrow: '1',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h5">{t('No Collectibles')}</Typography>
      <Typography variant="body2">
        {t('You don’t have any collectibles yet.')}
      </Typography>
    </Stack>
  );
}
