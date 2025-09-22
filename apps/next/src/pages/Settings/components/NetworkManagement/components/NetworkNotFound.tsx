import { Page } from '@/components/Page';
import { Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

export const NetworkNotFound = () => {
  const { t } = useTranslation();
  return (
    <Page withBackButton>
      <Stack>
        <Typography variant="h2">{t('Network not found')}</Typography>
      </Stack>
    </Page>
  );
};
