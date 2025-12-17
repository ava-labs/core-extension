import { Network } from '@avalabs/core-chains-sdk';
import { ExtensionRequest, NetworkWithCaipId } from '@core/types';
import { GetTokenPriceHandler } from '@core/service-worker';
import { useBalancesContext, useConnectionContext } from '../contexts';
import { useEffect, useState } from 'react';

export function useNativeTokenPrice(network?: Network) {
  const { request } = useConnectionContext();
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    const symbol = network?.networkToken.symbol;

    if (symbol) {
      request<GetTokenPriceHandler>({
        method: ExtensionRequest.TOKEN_PRICE_GET_NATIVE,
        params: [symbol],
      })
        .then((p) => setPrice(p || 0))
        .catch(() => setPrice(0));
    } else {
      setPrice(0);
    }
  }, [network, request]);

  return price;
}

export function useTokenPrice(address?: string, network?: NetworkWithCaipId) {
  const { getTokenPrice } = useBalancesContext();
  const [tokenPrice, setTokenPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!address) return;

    getTokenPrice(address, network).then((price) => {
      setTokenPrice(price ?? null);
    });
  }, [getTokenPrice, address, network]);

  return tokenPrice;
}
