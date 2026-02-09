import { BridgeType } from '@avalabs/bridge-unified';
import {
  AvalancheHorizontalIcon,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useBridgeState } from '../../../contexts';

const isLombardBridgeType = (bridgeType?: BridgeType) => {
  return (
    bridgeType === BridgeType.LOMBARD_BTC_TO_BTCB ||
    bridgeType === BridgeType.LOMBARD_BTCB_TO_BTC
  );
};

export const BridgeProviderNotice = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { asset: target, query } = useBridgeState();

  const [bridgeType] = target?.destinations[query.targetNetwork] ?? [];

  const isLombard = isLombardBridgeType(bridgeType);
  const icon =
    bridgeType === BridgeType.CCTP ? (
      <img
        src="/images/bridge-providers/circle.png"
        height={14}
        alt="Circle"
        style={{ filter: 'contrast(0.05)' }}
      />
    ) : isLombard ? (
      <img
        src={`/images/bridge-providers/lombard-wordmark-${theme.palette.mode}.svg`}
        style={{ filter: 'contrast(0.05)', height: 24, marginLeft: -4 }}
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
      <Typography
        variant="caption"
        fontSize={8.25}
        paddingTop={isLombard ? 0.25 : 0.5}
      >
        {t('Powered by')}
      </Typography>
      {icon}
    </Stack>
  );
};
