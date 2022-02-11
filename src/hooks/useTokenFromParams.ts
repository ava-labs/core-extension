import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TokenWithBalance } from '@avalabs/wallet-react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';

export function useTokenFromParams() {
  const { search } = useLocation();
  const { erc20Tokens, avaxToken } = useWalletContext();
  const [selectedToken, setSelectedToken] =
    useState<TokenWithBalance>(avaxToken);

  const { tokenSymbol, tokenAddress } = useMemo(
    () =>
      (Object as any).fromEntries(
        (new URLSearchParams(search) as any).entries()
      ),
    [search]
  );

  useEffect(() => {
    const targetToken =
      tokenSymbol === 'AVAX'
        ? avaxToken
        : erc20Tokens?.find((token) => token.address === tokenAddress);
    setSelectedToken(targetToken ?? avaxToken);
  }, [tokenSymbol, tokenAddress, erc20Tokens, avaxToken]);

  return selectedToken;
}
