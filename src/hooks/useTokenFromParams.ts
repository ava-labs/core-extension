import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { TokenWithBalance } from '@src/background/services/balances/models';
import { useTokensWithBalances } from './useTokensWithBalances';

export function useTokenFromParams(withDefault?: true): TokenWithBalance;
export function useTokenFromParams(
  withDefault?: false
): TokenWithBalance | undefined;
export function useTokenFromParams(withDefault = true) {
  const { search } = useLocation();
  const allTokens = useTokensWithBalances(true);
  const [selectedToken, setSelectedToken] = useState<
    TokenWithBalance | undefined
  >(withDefault ? allTokens[0] : undefined);
  const { activeAccount } = useAccountsContext();

  const { tokenSymbol, tokenAddress } = useMemo(
    () =>
      (Object as any).fromEntries(
        (new URLSearchParams(search) as any).entries()
      ),
    [search]
  );

  useEffect(() => {
    const targetToken = allTokens?.find((token) =>
      token.isERC20
        ? token.address === tokenAddress
        : token.symbol === tokenSymbol
    );
    if (!targetToken && !withDefault) return;
    setSelectedToken(targetToken ?? allTokens[0]);
  }, [tokenSymbol, tokenAddress, allTokens, activeAccount, withDefault]);

  return selectedToken;
}
