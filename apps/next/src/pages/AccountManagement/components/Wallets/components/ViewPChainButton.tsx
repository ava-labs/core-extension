import { Button, OutboundIcon, Stack } from '@avalabs/k2-alpine';
import { useNetworkContext } from '@core/ui';
import { useTranslation } from 'react-i18next';

export const ViewPChainButton = () => {
  const { isDeveloperMode } = useNetworkContext();
  const { t } = useTranslation();
  return (
    <Stack direction="row" justifyContent="flex-end" px={2} mt={1}>
      <Button
        size="small"
        variant="text"
        onClick={() => {
          window.open(
            `https://${
              isDeveloperMode ? 'test.' : ''
            }core.app/tools/utxo-manager`,
            '_blank',
            'noreferrer',
          );
        }}
        endIcon={<OutboundIcon />}
      >
        {t('View P-Chain Details')}
      </Button>
    </Stack>
  );
};
