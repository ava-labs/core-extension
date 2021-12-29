import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TokenWithBalance } from '@avalabs/wallet-react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useTokensWithBalances } from './useTokensWithBalances';

export function useTokenFromParams() {
  const { avaxToken, erc20Tokens, antTokens } = useWalletContext();
  const { search } = useLocation();
  const [selectedToken, setSelectedToken] = useState<TokenWithBalance>();
  const tokensWBalances: TokenWithBalance[] = useTokensWithBalances();
  const tokens = tokensWBalances ?? [avaxToken, ...erc20Tokens, ...antTokens];
  useEffect(() => {
    // need to update ts target version so support this feature, browser supports it
    const { token } = (Object as any).fromEntries(
      (new URLSearchParams(search) as any).entries()
    );
    const targetToken = tokens?.find(
      (availToken) => availToken.symbol === token
    );
    targetToken && setSelectedToken(targetToken as TokenWithBalance);
  }, [search, tokensWBalances]);

  return selectedToken || avaxToken;
}
