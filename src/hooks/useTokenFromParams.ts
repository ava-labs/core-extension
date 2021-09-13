import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AVAX_TOKEN, TokenWithBalance } from './useTokensWithBalances';

export function useTokenFromParams(tokensWBalances: TokenWithBalance[]) {
  const { search } = useLocation();
  const [selectedToken, setSelectedToken] = useState<TokenWithBalance>();

  useEffect(() => {
    // need to update ts target version so support this feature, browser supports it
    const { token } = (Object as any).fromEntries(
      (new URLSearchParams(search) as any).entries()
    );
    const targetToken = [AVAX_TOKEN, ...tokensWBalances]?.find(
      (availToken) => availToken.symbol === token
    );
    targetToken && setSelectedToken(targetToken);
  }, [search, tokensWBalances]);
  return selectedToken || AVAX_TOKEN;
}
