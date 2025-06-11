import { Button, OutboundIcon, SxProps } from '@avalabs/k2-alpine';
import { useNetworkContext } from '@core/ui';
import { useTranslation } from 'react-i18next';

const sx: SxProps = {
  marginInline: 'auto',
  gap: 0,
};

export const ViewPChainButton = () => {
  const { isDeveloperMode } = useNetworkContext();
  const { t } = useTranslation();
  const subdomain = isDeveloperMode ? 'test.' : '';
  return (
    <Button
      sx={sx}
      size="small"
      variant="text"
      href={`https://${subdomain}core.app/tools/utxo-manager`}
      target="_blank"
      rel="noreferrer"
      endIcon={<OutboundIcon />}
    >
      {t('View P-Chain Details')}
    </Button>
  );
};
