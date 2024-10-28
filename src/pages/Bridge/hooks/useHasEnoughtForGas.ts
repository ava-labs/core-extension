import { TokenType } from '@avalabs/vm-module-types';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import Big from 'big.js';
import { useEffect, useState } from 'react';

export const useHasEnoughForGas = (gasLimit?: bigint): boolean => {
  const tokens = useTokensWithBalances();
  const { networkFee } = useNetworkFeeContext();

  const [hasEnough, setHasEnough] = useState(true);

  useEffect(() => {
    if (!tokens || !networkFee || !gasLimit) return;
    const token = tokens.find((x) => x.type === TokenType.NATIVE);

    // If the native token has no blance, we do not have enough
    if (!token) {
      setHasEnough(false);
      return;
    }

    // get gasPrice of network
    const balance = token && token.balance;
    const estimatedGasCost = networkFee.low.maxFeePerGas * gasLimit;
    // check if balance > gasPrice
    if (balance && estimatedGasCost) {
      setHasEnough(
        new Big(balance.toString()).gte(estimatedGasCost.toString())
      );
    }
  }, [tokens, networkFee, gasLimit]);

  return hasEnough;
};
