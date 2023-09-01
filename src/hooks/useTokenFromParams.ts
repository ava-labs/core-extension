import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import { useTokensWithBalances } from './useTokensWithBalances';
import xss from 'xss';

export function useTokenFromParams(
  withDefault = true
): TokenWithBalance | undefined {
  const { search } = useLocation();
  const allTokens = useTokensWithBalances(true);
  const [selectedToken, setSelectedToken] = useState<
    TokenWithBalance | undefined
  >(undefined);
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();

  const { tokenSymbol, tokenAddress } = useMemo(() => {
    const { tokenSymbol: rawTokenSymbol, tokenAddress: rawTokenAddress } = (
      Object as any
    ).fromEntries((new URLSearchParams(search) as any).entries());

    return {
      tokenSymbol: xss(rawTokenSymbol),
      tokenAddress: xss(rawTokenAddress),
    };
  }, [search]);

  useEffect(() => {
    let firstNativeToken: TokenWithBalance | undefined;

    /**
     * Tries to find ERC20 token by its address or a native token by its symbol
     * Stores the first native token as a possible fallback value
     */
    const targetToken = allTokens?.find((token) => {
      if (!firstNativeToken && token.type === TokenType.NATIVE) {
        firstNativeToken = token;
      }

      return token.type === TokenType.ERC20
        ? token.address === tokenAddress
        : token.type === TokenType.NATIVE
        ? token.symbol === tokenSymbol
        : false;
    });

    if (!targetToken && !withDefault) return;

    setSelectedToken(targetToken ?? (firstNativeToken || allTokens?.[0]));
  }, [tokenSymbol, tokenAddress, allTokens, activeAccount, withDefault]);

  return selectedToken;
}
