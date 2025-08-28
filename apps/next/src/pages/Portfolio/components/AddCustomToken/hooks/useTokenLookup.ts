import { TokenType } from '@avalabs/vm-module-types';
import { useTokensWithBalances } from '@core/ui';
import { useCallback, useMemo } from 'react';

type UseTokenLookup = (tokenAddress: string) => boolean;

export function useTokenLookup(): UseTokenLookup {
  const tokens = useTokensWithBalances({
    forceShowTokensWithoutBalances: true,
  });

  const tokenLookup = useMemo(
    () =>
      new Set(
        tokens
          .filter((token) => token.type === TokenType.ERC20)
          .map((token) => token.address.toLowerCase()),
      ),
    [tokens],
  );

  return useCallback(
    (tokenAddress: string) => tokenLookup.has(tokenAddress.toLowerCase()),
    [tokenLookup],
  );
}
