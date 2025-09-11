import { TokenType } from '@avalabs/vm-module-types';
import { useTokensWithBalances } from '@core/ui';
import { useMemo } from 'react';

type UseTokenLookup = (tokenAddress: string) => boolean;

export function useTokenLookup(): UseTokenLookup {
  const tokens = useTokensWithBalances({
    forceShowTokensWithoutBalances: true,
  });

  return useMemo<UseTokenLookup>(() => {
    const lookup = new Set(
      tokens
        .filter((token) => token.type === TokenType.ERC20)
        .map((token) => token.address.toLowerCase()),
    );
    return (address: string) => lookup.has(address.toLowerCase());
  }, [tokens]);
}
