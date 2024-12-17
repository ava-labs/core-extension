import {
  NftTokenWithBalance,
  TokenType,
  TokenWithBalance,
} from '@avalabs/vm-module-types';

import { DISALLOWED_SWAP_ASSETS } from '@src/contexts/SwapProvider/models';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';

type RequestedTokens = {
  // Provide `true` for native tokens and the address for ERC-*
  [symbol: string]: string | boolean;
};

type Result<T extends RequestedTokens> = Record<
  keyof T,
  Exclude<TokenWithBalance, NftTokenWithBalance> | undefined
>;

export function useTokensBySymbols<T extends RequestedTokens>(
  requestedTokens: T,
): Result<T> {
  const balances = useTokensWithBalances({
    disallowedAssets: DISALLOWED_SWAP_ASSETS,
    forceShowTokensWithoutBalances: true,
  });

  return Object.entries(requestedTokens).reduce(
    (dict, [symbol, identifier]) => {
      if (!identifier) {
        return dict;
      }

      return {
        ...dict,
        [symbol]: balances.find((token) => {
          if (typeof identifier === 'boolean') {
            return token.type === TokenType.NATIVE && token.symbol === symbol;
          } else if (typeof identifier === 'string') {
            return (
              token.type !== TokenType.NATIVE &&
              token.address.toLowerCase() === identifier.toLowerCase()
            );
          }
        }),
      };
    },
    {} as Result<T>,
  );
}
