import { useEffect, useState } from 'react';

import { useNetworkFeeContext } from '@core/ui';
import {
  FungibleTokenBalance,
  isErc20Token,
  isEvmNativeToken,
} from '@core/types';

import { getEvmMaxAmount } from './lib';

type MaxAmountInfo = {
  maxAmount: bigint;
  estimatedFee: bigint;
};

export const useMaxAmountForTokenSend = (
  token?: FungibleTokenBalance,
): MaxAmountInfo => {
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
  }, [token, getNetworkFee]);

  return result;
};
