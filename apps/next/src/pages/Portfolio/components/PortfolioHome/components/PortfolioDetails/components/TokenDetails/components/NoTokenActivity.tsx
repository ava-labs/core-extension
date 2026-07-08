import { Stack, Typography } from '@avalabs/k2-alpine';
import { NetworkWithCaipId } from '@core/types';
import { useTranslation } from 'react-i18next';
import { ExplorerButton } from './ExplorerButton';

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
      <Typography variant="subtitle3">{t('No recent transactions')}</Typography>
      <Typography variant="caption" color="text.secondary">
        {t('Check full transaction history on the explorer')}
      </Typography>

      <ExplorerButton network={network}>{t('View on explorer')}</ExplorerButton>
    </Stack>
  );
};
