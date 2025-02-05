import type { Network } from '@avalabs/core-chains-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import type { GetTokenPriceHandler } from '@src/background/services/balances/handlers/getTokenPrice';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useEffect, useState } from 'react';

export function useNativeTokenPrice(network?: Network) {
  const { request } = useConnectionContext();
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    const tokenId = network?.pricingProviders?.coingecko.nativeTokenId;

    if (tokenId) {
      request<GetTokenPriceHandler>({
        method: ExtensionRequest.TOKEN_PRICE_GET,
        params: [tokenId],
      })
        .then((p) => setPrice(p || 0))
        .catch(() => setPrice(0));
    } else {
      setPrice(0);
    }
  }, [network, request]);

  return price;
}
