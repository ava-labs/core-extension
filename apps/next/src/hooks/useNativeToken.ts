import { useMemo } from 'react';
import { TokenType } from '@avalabs/vm-module-types';

import { NativeTokenBalance, NetworkWithCaipId } from '@core/types';
import { useTokensWithBalances } from '@core/ui';

type UseNativeTokenArgs = { network: NetworkWithCaipId };

export const useNativeToken = ({ network }: UseNativeTokenArgs) => {
  const tokens = useTokensWithBalances({ network });

  return useMemo(
    () => tokens.find(({ type }) => type === TokenType.NATIVE),
    [tokens],
  ) as NativeTokenBalance;
};
