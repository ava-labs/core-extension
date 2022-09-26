import { TokenType } from '@src/background/services/balances/models';
import { useNetworkFeeContext } from '@src/contexts/NetworkFeeProvider';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import Big from 'big.js';
import { useMemo, useState } from 'react';

export const useHasEnoughForGas = (): boolean => {
  const tokens = useTokensWithBalances();
  const { networkFee } = useNetworkFeeContext();

  const [hasEnough, setHasEnough] = useState(true);

  useMemo(() => {
    if (!tokens || !networkFee) return;
    const token = tokens.find((x) => x.type === TokenType.NATIVE);
    // get gasPrice of network
    const balance = token && token.balance;
    const estimatedGasCost = networkFee.low;
    // check if balance > gasPrice
    if (balance && estimatedGasCost) {
      setHasEnough(
        new Big(balance.toString()).gte(estimatedGasCost.toString())
      );
    }
  }, [tokens, networkFee]);

  return hasEnough;
};
