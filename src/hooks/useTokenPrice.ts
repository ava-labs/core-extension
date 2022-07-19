import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { GetTokenPriceHandler } from '@src/background/services/balances/handlers/getTokenPrice';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useEffect, useState } from 'react';

export function useNativeTokenPrice() {
  const { request } = useConnectionContext();
  const { network } = useNetworkContext();
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
