import { ChainId } from '@avalabs/chains-sdk';
import { Account } from '@src/background/services/accounts/models';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useMemo } from 'react';

export function useBalanceTotalInCurrency(account?: Account) {
  const { tokens } = useBalancesContext();

  return useMemo(() => {
    // don't freak users out by display falsely a 0 balance when we just don't know the usd value
    if (!account || !tokens.balances) {
      return null;
    }

    return Object.keys(tokens.balances).reduce((total, network) => {
      const address =
        network === ChainId.BITCOIN.toString() ||
        network === ChainId.BITCOIN_TESTNET.toString()
          ? account.addressBTC
          : account.addressC;
      return (
        total +
        (tokens.balances?.[network][address]?.reduce(
          (sum, token) => sum + (token.balanceUSD ?? 0),
          0
        ) || 0)
      );
    }, 0);
  }, [account, tokens]);
}
