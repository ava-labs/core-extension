import { generateOnRampURL } from '@coinbase/cbpay-js';
import { useCallback } from 'react';

export function useCoinbasePay() {
  const coinbaseUrlByAddress = useCallback((address: string) => {
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
  }, []);

  return { coinbaseUrlByAddress };
}
