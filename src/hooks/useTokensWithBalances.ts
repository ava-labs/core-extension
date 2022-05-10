import { useWalletContext } from '@src/contexts/WalletProvider';
import { useMemo } from 'react';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { TokenWithBalance } from '@avalabs/wallet-react-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useAccountsContext } from '@src/contexts/AccountsProvider';

const bnZero = new BN(0);

export function useTokensWithBalances(
  forceShowTokensWithoutBalances?: boolean
) {
  const { erc20Tokens, avaxPrice, avaxToken } = useWalletContext();
  const { showTokensWithoutBalances } = useSettingsContext();
  const { activeAccount } = useAccountsContext();
  const balances = useBalancesContext();

  return useMemo<TokenWithBalance[]>(() => {
    const btcBalances =
      (activeAccount && balances[activeAccount.addressBTC]) || [];

    return [
      {
        ...avaxToken,
        priceUSD: avaxPrice,
      },
      ...(btcBalances as any[]),
      ...erc20Tokens.filter((token) => {
        if (forceShowTokensWithoutBalances !== undefined) {
          return forceShowTokensWithoutBalances
            ? true
            : token.balance.gt(bnZero);
        }
        return showTokensWithoutBalances ? true : token.balance.gt(bnZero);
      }),
    ];
  }, [
    activeAccount,
    balances,
    avaxToken,
    avaxPrice,
    erc20Tokens,
    forceShowTokensWithoutBalances,
    showTokensWithoutBalances,
  ]);
}
