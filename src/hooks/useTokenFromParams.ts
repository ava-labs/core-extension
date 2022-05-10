import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TokenWithBalance } from '@avalabs/wallet-react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { BTC_TOKEN } from '@src/background/services/network/models';

export function useTokenFromParams() {
  const { search } = useLocation();
  const { erc20Tokens, avaxToken } = useWalletContext();
  const [selectedToken, setSelectedToken] =
    useState<TokenWithBalance>(avaxToken);
  const { activeAccount } = useAccountsContext();
  const balances = useBalancesContext();

  const { tokenSymbol, tokenAddress } = useMemo(
    () =>
      (Object as any).fromEntries(
        (new URLSearchParams(search) as any).entries()
      ),
    [search]
  );

  useEffect(() => {
    // TODO this should be temporary
    const btcToken = {
      ...BTC_TOKEN,
      ...((activeAccount && balances[activeAccount.addressBTC]) || [])[0],
    };
    const targetToken =
      tokenSymbol === 'AVAX'
        ? avaxToken
        : tokenSymbol === btcToken.symbol
        ? btcToken
        : erc20Tokens?.find((token) => token.address === tokenAddress);
    setSelectedToken(targetToken ?? avaxToken);
  }, [
    tokenSymbol,
    tokenAddress,
    erc20Tokens,
    avaxToken,
    activeAccount,
    balances,
  ]);

  return selectedToken;
}
