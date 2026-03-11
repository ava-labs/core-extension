import { useTranslation } from 'react-i18next';
import { ServiceType } from '@avalabs/fusion-sdk';
import { Stack, useTheme, Typography, Collapse } from '@avalabs/k2-alpine';

import { useFusionState } from '../contexts';

export const SwapProviderNotice = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { selectedQuote } = useFusionState();

  const serviceType = selectedQuote?.serviceType;

  const isLombard =
    serviceType === ServiceType.LOMBARD_BTC_TO_BTCB ||
    serviceType === ServiceType.LOMBARD_BTCB_TO_BTC;

  return (
    <Collapse in={isLombard} mountOnEnter>
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
        <img
          src={`/images/bridge-providers/lombard-wordmark-${theme.palette.mode}.svg`}
          style={{ filter: 'contrast(0.05)', height: 24, marginLeft: -4 }}
        />
      </Stack>
    </Collapse>
  );
};
