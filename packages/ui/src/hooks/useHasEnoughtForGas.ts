import { TokenType } from '@avalabs/vm-module-types';
import { useEffect, useState } from 'react';
import { useTokensWithBalances } from './useTokensWithBalances';

export const useHasEnoughForGas = (
  sendAmount?: bigint,
  feeRate?: bigint,
  gasLimit?: bigint,
): boolean => {
  const tokens = useTokensWithBalances();

  const [hasEnough, setHasEnough] = useState(true);

  useEffect(() => {
    if (
      !tokens ||
      !gasLimit ||
      typeof sendAmount !== 'bigint' ||
      typeof feeRate !== 'bigint'
    )
      return;
    const token = tokens.find((x) => x.type === TokenType.NATIVE);

    // If the native token has no balance, we do not have enough
    if (!token) {
      setHasEnough(false);
      return;
    }

    // get gasPrice of network
    const balance = token && token.balance;
    const estimatedGasCost = feeRate * gasLimit;

    // check if balance > gasPrice
    if (balance && estimatedGasCost) {
      setHasEnough(balance >= sendAmount + estimatedGasCost);
    }
  }, [tokens, feeRate, sendAmount, gasLimit]);

  return hasEnough;
};
