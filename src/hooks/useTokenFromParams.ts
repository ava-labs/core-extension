import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TokenWithBalance } from '@avalabs/wallet-react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useTokensWithBalances } from './useTokensWithBalances';

export function useTokenFromParams() {
  const { avaxToken } = useWalletContext();
  const { search } = useLocation();
  const [selectedToken, setSelectedToken] =
    useState<TokenWithBalance>(avaxToken);
  const tokensWBalances: TokenWithBalance[] = useTokensWithBalances();

  useEffect(() => {
    // need to update ts target version so support this feature, browser supports it
    const { token } = (Object as any).fromEntries(
      (new URLSearchParams(search) as any).entries()
    );
    const targetToken = tokensWBalances?.find(
      (availToken) => availToken.symbol === token
    );
    targetToken && setSelectedToken(targetToken as TokenWithBalance);

    // We need to disable this because we don't want to use the `search` as a source of truth for
    // selected token (for performance and convenience reasons), but including `tokensWithBalances`
    // in the dependency array will cause extraneous updates of selectedToken.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return selectedToken;
}
