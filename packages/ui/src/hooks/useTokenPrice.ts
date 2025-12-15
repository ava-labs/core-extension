import { Network } from '@avalabs/core-chains-sdk';
import { ExtensionRequest, NetworkWithCaipId } from '@core/types';
import { GetTokenPriceHandler } from '@core/service-worker';
import { useBalancesContext, useConnectionContext } from '../contexts';
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

export function useTokenPrice(
  addressOrSymbol?: string,
  network?: NetworkWithCaipId,
) {
  const { getTokenPrice } = useBalancesContext();
  const [tokenPrice, setTokenPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!addressOrSymbol) return;

    getTokenPrice(addressOrSymbol, network).then((price) => {
      setTokenPrice(price ?? null);
    });
  }, [getTokenPrice, addressOrSymbol, network]);

  return tokenPrice;
}
