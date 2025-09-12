import { useMemo } from 'react';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { MdInfoOutline } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { Box, Fade, Stack, Tooltip, Typography } from '@avalabs/k2-alpine';

import {
  JUPITER_PARTNER_FEE_BPS,
  PARASWAP_PARTNER_FEE_BPS,
  SwapProviders,
  useFeatureFlagContext,
  useSwapContext,
} from '@core/ui';
import { FeatureGates } from '@core/types';

import { useSwapState } from '../contexts';
import { formatBasisPointsToPercentage } from '../lib/formatBasisPointsToPercentage';

export const CoreFeeNotice = () => {
  const { t } = useTranslation();

  const { provider } = useSwapState();
  const { swapNetwork } = useSwapContext();
  const { isFlagEnabled } = useFeatureFlagContext();

  const coreFee = useMemo(() => {
    if (!swapNetwork || !provider || provider === SwapProviders.WNATIVE) {
      return '';
    }

    if (
      swapNetwork.vmName === NetworkVMType.EVM &&
      isFlagEnabled(FeatureGates.SWAP_FEES)
    ) {
      return formatBasisPointsToPercentage(PARASWAP_PARTNER_FEE_BPS);
    }

    if (
      swapNetwork.vmName === NetworkVMType.SVM &&
      isFlagEnabled(FeatureGates.SWAP_FEES_JUPITER)
    ) {
      return formatBasisPointsToPercentage(JUPITER_PARTNER_FEE_BPS);
    }

    return '';
  }, [isFlagEnabled, swapNetwork, provider]);

  return (
    <Fade in={Boolean(coreFee)}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={0.5}
      >
        <Typography variant="caption" color="text.secondary" textAlign="center">
          {t('Quote includes an {{coreFee}} Core fee', {
            coreFee,
          })}
        </Typography>
        <Tooltip
          title={
            coreFee
              ? t(
                  'Core always finds the best price from the top liquidity providers. A fee of {{coreFee}} is automatically factored into this quote.',
                  {
                    coreFee,
                  },
                )
              : ''
          }
        >
          <Box
            display="flex"
            flexShrink={0}
            lineHeight={1}
            color="text.secondary"
          >
            <MdInfoOutline color="text.secondary" size={16} />
          </Box>
        </Tooltip>
      </Stack>
    </Fade>
  );
};
