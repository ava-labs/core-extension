import { ChainId } from '@avalabs/chains-sdk';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useMemo } from 'react';

export function useBalanceTotalInCurrency() {
  const { balances } = useBalancesContext();
  const { activeAccount } = useAccountsContext();

  return useMemo(() => {
    // don't freak users out by display falsely a 0 balance when we just don't know the usd value
    if (!activeAccount || !balances) {
      return null;
    }

    return Object.keys(balances).reduce((total, network) => {
      const address =
        network === ChainId.BITCOIN.toString() ||
        network === ChainId.BITCOIN_TESTNET.toString()
          ? activeAccount.addressBTC
          : activeAccount.addressC;
      return (
        total +
        (balances[network][address]?.reduce(
          (sum, token) => sum + (token.balanceUSD ?? 0),
          0
        ) || 0)
      );
    }, 0);
  }, [activeAccount, balances]);
}
