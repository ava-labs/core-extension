import { Divider, Stack } from '@avalabs/k2-alpine';

import { Card } from '@/components/Card';

import { SwapPricing } from './SwapPricing';
import { SwapSlippage } from './SwapSlippage';

export const SwapSettings = () => {
  return (
    <Card>
      <Stack width="100%" flexGrow={1} divider={<Divider />} px={2}>
        <SwapPricing />
        <SwapSlippage />
      </Stack>
    </Card>
  );
};
