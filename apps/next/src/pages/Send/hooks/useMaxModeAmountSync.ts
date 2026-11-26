import { TokenUnit } from '@avalabs/core-utils-sdk';
import { useEffect } from 'react';

import {
  FungibleTokenBalance,
  isBtcToken,
  isEvmNativeToken,
} from '@core/types';

type UseMaxModeAmountSyncArgs = {
  isMaxMode: boolean;
  maxAmount?: bigint;
  token?: FungibleTokenBalance;
  amount: string;
  onSync: (amount: string) => void;
};

export const isMaxModeSupportedToken = (token?: FungibleTokenBalance) =>
  Boolean(token && (isEvmNativeToken(token) || isBtcToken(token)));

export const useMaxModeAmountSync = ({
  isMaxMode,
  maxAmount,
  token,
  amount,
  onSync,
}: UseMaxModeAmountSyncArgs) => {
  useEffect(() => {
    if (
      !isMaxMode ||
      !token ||
      maxAmount === undefined ||
      !isMaxModeSupportedToken(token)
    ) {
      return;
    }

    const next =
      maxAmount <= 0n
        ? '0'
        : new TokenUnit(maxAmount, token.decimals, token.symbol).toString();

    if (next !== amount) {
      onSync(next);
    }
  }, [isMaxMode, maxAmount, token, amount, onSync]);
};
