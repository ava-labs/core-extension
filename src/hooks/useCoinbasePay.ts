import { generateOnRampURL } from '@coinbase/cbpay-js';
import { useMemo } from 'react';

export function useCoinbasePay(address: string) {
  const coinbaseUrlByAddress = useMemo(() => {
    const appId = process.env.COINBASE_APP_ID;
    if (!appId) {
      throw new Error('Coinbase appId is wrong');
    }
    return generateOnRampURL({
      appId,
      destinationWallets: [
        {
          address,
          assets: ['AVAX', 'ETH'],
        },
      ],
    });
  }, [address]);

  return { coinbaseUrlByAddress };
}
