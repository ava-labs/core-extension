import { useEffect, useState } from 'react';

import { useNetworkContext, useNetworkFeeContext } from '@core/ui';
import {
  FungibleTokenBalance,
  isBtcToken,
  isErc20Token,
  isEvmNativeToken,
} from '@core/types';

import { getEvmMaxAmount } from './lib';
import { getBtcMaxAmount } from './lib/getBtcMaxAmount';

type MaxAmountInfo = {
  maxAmount: bigint;
  estimatedFee: bigint;
};

export const useMaxAmountForTokenSend = (
  from: string,
  token?: FungibleTokenBalance,
  to?: string,
): MaxAmountInfo => {
  const { getNetwork } = useNetworkContext();
  const { getNetworkFee } = useNetworkFeeContext();

  const [result, setResult] = useState<MaxAmountInfo>({
    maxAmount: 0n,
    estimatedFee: 0n,
  });

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    getNetworkFee(token.coreChainId)
      .then((networkFee) => {
        if (!networkFee || !isMounted) {
          return;
        }

        if (isEvmNativeToken(token) || isErc20Token(token)) {
          setResult(getEvmMaxAmount(networkFee, token));
        } else if (to && isBtcToken(token)) {
          getBtcMaxAmount(
            networkFee,
            token,
            from,
            to,
            getNetwork(token.coreChainId),
          ).then((res) => isMounted && setResult(res));
        }
      })
      .catch((error) => {
        console.error(
          'Error while estimating max send amount for token',
          token,
          error,
        );
      });

    return () => {
      isMounted = false;
    };
  }, [token, getNetworkFee, from, to, getNetwork]);

  return result;
};
