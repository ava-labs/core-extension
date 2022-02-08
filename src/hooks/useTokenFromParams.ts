import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TokenWithBalance } from '@avalabs/wallet-react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';

export function useTokenFromParams() {
  const { search } = useLocation();
  const { erc20Tokens, avaxToken } = useWalletContext();
  const [selectedToken, setSelectedToken] =
    useState<TokenWithBalance>(avaxToken);

  useEffect(() => {
    const { tokenSymbol, tokenAddress } = (Object as any).fromEntries(
      (new URLSearchParams(search) as any).entries()
    );

    const targetToken =
      tokenSymbol === 'AVAX'
        ? avaxToken
        : erc20Tokens?.find((token) => token.address === tokenAddress);
    setSelectedToken(targetToken ?? avaxToken);
  }, [search, erc20Tokens, avaxToken]);

  return selectedToken;
}
