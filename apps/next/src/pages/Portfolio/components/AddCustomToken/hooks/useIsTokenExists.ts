import { TokenType } from '@avalabs/vm-module-types';
import { useTokensWithBalances } from '@core/ui';
import { useMemo } from 'react';

export function useIsTokenExists(tokenAddress: string): boolean {
  const tokens = useTokensWithBalances({
    forceShowTokensWithoutBalances: true,
  });

  const existingToken = useMemo(
    () =>
      tokens.some(
        (token) =>
          token.type === TokenType.ERC20 &&
          token.address.toLowerCase() === tokenAddress.toLowerCase(),
      ),
    [tokens, tokenAddress],
  );

  return existingToken;
}
