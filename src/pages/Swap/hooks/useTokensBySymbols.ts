import {
  NetworkTokenWithBalance,
  TokenType,
  TokenWithBalanceERC20,
} from '@avalabs/vm-module-types';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

import { DISALLOWED_SWAP_ASSETS } from '@src/contexts/SwapProvider/models';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';

type RequestedTokens = {
  // Provide `true` for native tokens and the address for ERC-*
  [symbol: string]: readonly string[] | boolean;
};

type Result<T extends RequestedTokens> = Record<
  keyof T,
  NetworkTokenWithBalance | TokenWithBalanceERC20 | undefined
>;

export function useTokensBySymbols<T extends RequestedTokens>(
  requestedTokens: T,
): Result<T> {
  const { network } = useNetworkContext();
  const balances = useTokensWithBalances({
    disallowedAssets: DISALLOWED_SWAP_ASSETS,
    forceShowTokensWithoutBalances: true,
  });

  const nativeSymbol = network?.networkToken.symbol;

  return Object.entries(requestedTokens).reduce(
    (dict, [symbol, identifier]) => {
      if (!identifier) {
        return dict;
      }

      return {
        ...dict,
        [symbol]: balances.find((token) => {
          if (typeof identifier === 'boolean') {
            return (
              token.type === TokenType.NATIVE && token.symbol === nativeSymbol
            );
          } else if (Array.isArray(identifier)) {
            return (
              token.type !== TokenType.NATIVE &&
              identifier.includes(token.address.toLowerCase())
            );
          }
        }),
      };
    },
    {} as Result<T>,
  );
}
