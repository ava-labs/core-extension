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
  >(withDefault ? allTokens?.[0] : undefined);
  const { activeAccount } = useAccountsContext();

  const { tokenSymbol, tokenAddress } = useMemo(() => {
    const { tokenSymbol, tokenAddress } = (Object as any).fromEntries(
      (new URLSearchParams(search) as any).entries()
    );

    return {
      tokenSymbol: xss(tokenSymbol),
      tokenAddress: xss(tokenAddress),
    };
  }, [search]);

  useEffect(() => {
    const targetToken = allTokens?.find((token) =>
      token.type === TokenType.ERC20
        ? token.address === tokenAddress
        : token.type === TokenType.NATIVE
        ? token.symbol === tokenSymbol
        : false
    );
    if (!targetToken && !withDefault) return;
    setSelectedToken(targetToken ?? allTokens?.[0]);
  }, [tokenSymbol, tokenAddress, allTokens, activeAccount, withDefault]);

  return selectedToken;
}
