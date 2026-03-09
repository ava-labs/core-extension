import {
  Stack,
  useTheme,
  Typography,
  AvalancheHorizontalIcon,
  Collapse,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { ServiceType } from '@avalabs/fusion-sdk';

import { useFusionState } from '../contexts';
import { AVALANCHE_C_CHAIN_CAIP2ID } from '../fusion-config';

export const SwapProviderNotice = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { selectedQuote } = useFusionState();

  const serviceType = selectedQuote?.serviceType;

  const isLombard =
    serviceType === ServiceType.LOMBARD_BTC_TO_BTCB ||
    serviceType === ServiceType.LOMBARD_BTCB_TO_BTC;

  const isAvalancheBridge = serviceType === ServiceType.AVALANCHE_EVM;

  const isOnAvalancheNetwork =
    selectedQuote?.sourceChain.chainId === AVALANCHE_C_CHAIN_CAIP2ID &&
    selectedQuote?.targetChain.chainId === AVALANCHE_C_CHAIN_CAIP2ID;

  const isPoweredByAvalanche = isAvalancheBridge || isOnAvalancheNetwork;

  const icon = isLombard ? (
    <img
      src={`/images/bridge-providers/lombard-wordmark-${theme.palette.mode}.svg`}
      style={{ filter: 'contrast(0.05)', height: 24, marginLeft: -4 }}
    />
  ) : isPoweredByAvalanche ? (
    <AvalancheHorizontalIcon size={60} />
  ) : null;

  return (
    <Collapse in={Boolean(icon)}>
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
    </Collapse>
  );
};
