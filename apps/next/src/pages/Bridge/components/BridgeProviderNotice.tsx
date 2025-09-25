import { AvalancheHorizontalIcon, Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

export const BridgeProviderNotice = () => {
  const { t } = useTranslation();

  return (
    <Stack
      direction="row"
      alignItems="center"
      textAlign="center"
      color="text.secondary"
      justifyContent="center"
      gap={0.5}
    >
      <Typography variant="caption">{t('Powered by')}</Typography>
      <AvalancheHorizontalIcon size={80} />
    </Stack>
  );
};
