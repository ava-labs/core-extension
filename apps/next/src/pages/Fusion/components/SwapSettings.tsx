import { Divider, Stack } from '@avalabs/k2-alpine';

import { Card } from '@/components/Card';

import { useFusionState } from '../contexts';

import { SwapPriceImpact } from './SwapPriceImpact';
import { SwapPricing } from './SwapPricing';
import { SwapSlippage } from './SwapSlippage';

export const SwapSettings = () => {
  const { priceImpactAvailability } = useFusionState();

  const showPriceImpactSection =
    priceImpactAvailability === 'unavailable' ||
    priceImpactAvailability === 'ready';

  return (
    <Card>
      <Stack width="100%" flexGrow={1} px={2}>
        <SwapPricing />
        <Divider />
        <SwapSlippage />
        {showPriceImpactSection && (
          <>
            <Divider />
            <SwapPriceImpact />
          </>
        )}
      </Stack>
    </Card>
  );
};
