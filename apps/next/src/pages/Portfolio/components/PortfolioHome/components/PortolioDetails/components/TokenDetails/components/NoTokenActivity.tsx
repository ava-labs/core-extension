import { Typography } from '@avalabs/k2-alpine';
import { Stack } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { ExplorerButton } from './ExplorerButton';
import { NetworkWithCaipId } from '@core/types';

export const NoTokenActivity = ({
  network,
}: {
  network: NetworkWithCaipId;
}) => {
  const { t } = useTranslation();

  return (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      gap={1}
      px={5}
      textAlign="center"
    >
      <Typography variant="subtitle3">{t('No recent transctions')}</Typography>
      <Typography variant="caption" color="text.secondary">
        {t('Check full transaction history on the explorer')}
      </Typography>

      <ExplorerButton network={network} buttonText={t('View on explorer')} />
    </Stack>
  );
};
