import { BridgeType } from '@avalabs/bridge-unified';
import { AvalancheHorizontalIcon, Stack, Typography } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useBridgeState } from '../../../contexts';

export const BridgeProviderNotice = () => {
  const { t } = useTranslation();
  const { asset: target, query } = useBridgeState();

  const [bridgeType] = target?.destinations[query.targetNetwork] ?? [];

  const icon =
    bridgeType === BridgeType.CCTP ? (
      <img
        src="/images/bridge-providers/circle.png"
        height={14}
        alt="Circle"
        style={{ filter: 'contrast(0.05)' }}
      />
    ) : (
      <AvalancheHorizontalIcon size={60} />
    );

  return (
    <Stack
      direction="row"
      alignItems="center"
      textAlign="center"
      color="text.secondary"
      justifyContent="center"
      gap={0.5}
    >
      <Typography variant="caption" fontSize={8.25} paddingTop={0.5}>
        {t('Powered by')}
      </Typography>
      {icon}
    </Stack>
  );
};
